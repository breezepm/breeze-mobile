import { Component, ElementRef, ViewChild, ViewContainerRef, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ViewController, TextInput, Platform } from 'ionic-angular';
import { Subject } from 'rxjs/';
import { defaultTo, prop, equals, not, clone, contains, path } from 'ramda';

import { AppState } from './../../../../app.reducer';
import { Task } from './../../../../models/tasks/task.model';
import { updateDescription } from './../../actions/task.actions';
import { isDefined } from './../../../../helpers/path-is-defined';
import { getInnerHtml } from './../../../../helpers/get-inner-html';
import { Keyboard } from '@ionic-native/keyboard';
import { Commenter } from '../../../../models/task-comment/task-comment.model';
import { parseUsersToMentionNamesAndIds } from '../../../../helpers/parse-users-to-mention-names-and-ids';

@Component({
  selector: 'modal-task-description',
  templateUrl: 'task-description.modal.html',
  styles: [ 'task-description.modal.scss' ],
})
export class TaskDescriptionModal implements OnInit {
  public keyboardHeight = 0;

  public taskUsers: Commenter[];

  public initialDescription: string;

  @ViewChild('textInput') private textInputRef: TextInput;

  private killer$: Subject<null> = new Subject();

  private task: Task;

  private mentionedNames: string[] = [];

  private currentMentionNames: string[] = [];
  private viewHeight: number;
  private isIos = true;

  constructor(
    private store: Store<AppState>,
    private viewCtrl: ViewController,
    private keyboard: Keyboard,
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
    public platform: Platform
  ) {}

  public ngOnInit() {
    this.isIos = this.platform.is('ios');
  }

  public ionViewWillLoad(): void {
    this.keyboard.disableScroll(true);
    this.resizeAreaUnderKeyboard();
    this.touchBlocking();
    this.store
      .select<Task>(state => state.task.fetchTask.value)
      .filter(isDefined)
      .takeUntil(this.killer$)
      .subscribe(task => {
        this.task = task;
        this.initialDescription = defaultTo('', prop<string>('description', task));
      });
    this.fetchTaskUsers();
  }

  public ionViewDidLoad() {
    this.viewHeight = path<number>(['element', 'nativeElement', 'offsetHeight'], this.viewContainerRef);
  }

  public ionViewWillUnload(): void {
    this.touchBlockingRemove();
    this.killer$.next();
  }

  public dismiss(): void {
    this.checkIfCurrentMentionsExistInTextArea();
    this.viewCtrl.dismiss();

    if (this.descriptionChanged) {
      this.updateDescription();
    }
  }

  public addMentionIdToArray(userName: string) {
    if (!contains( userName, this.mentionedNames)) {
      this.mentionedNames.push(userName);
    }
  }

  private fetchTaskUsers() {
    this.store.select<Commenter[]>('task', 'fetchTask', 'value', 'users')
      .takeUntil(this.killer$)
      .filter(isDefined)
      .subscribe((users) => {
        this.taskUsers = clone(users);
        this.taskUsers.push({ email: 'all users', id: -999 });
      });
  }

  private touchBlocking() {
    const element = this.elementRef.nativeElement;

    element.addEventListener('touchstart', (event) => {
      event.stopPropagation();
    });

    element.addEventListener('touchmove', (event) => {
      event.stopPropagation();
    });

    element.addEventListener('touchend', (event) => {
      event.stopPropagation();
    });
  }

  private touchBlockingRemove() {
    const element = this.elementRef.nativeElement;
    element.removeEventListener('touchstart');
    element.removeEventListener('touchend');
    element.removeEventListener('touchmove');
  }

  private resizeAreaUnderKeyboard() {
    this.keyboard.onKeyboardShow().takeUntil(this.killer$).subscribe((event) => {
      this.keyboardHeight = event.keyboardHeight + 20;
    });

    this.keyboard.onKeyboardHide().takeUntil(this.killer$).subscribe((event) => {
      this.keyboardHeight = 0;
    });
  }

  private updateDescription(): void {
    const newTask: Task = {
      ...this.task,
      description: this.taskDescription,
      mentions: this.mentionedUsersIdsToSend,
    };

    this.store.dispatch(updateDescription(newTask));
  }

  private checkIfCurrentMentionsExistInTextArea() {
    const elRef: ElementRef = this.textInputRef.getElementRef();
    const commentVal = elRef.nativeElement.textContent;
    this.currentMentionNames = this.mentionedNames.filter(name => commentVal.includes(name));
  }

  private get mentionedUsersIdsToSend() {
    const taskUsersMentionNamesAndIds = parseUsersToMentionNamesAndIds(this.taskUsers);
    const mentionedUsersIds = taskUsersMentionNamesAndIds
      .filter((user: Commenter) => this.currentMentionNames.includes(user.name))
      .map(user => user.id);

    return mentionedUsersIds;
  }

  private get descriptionChanged(): boolean {
    return not(equals(this.initialDescription, this.taskDescription));
  }

  private get taskDescription(): string {
    const elRef: ElementRef = this.textInputRef.getElementRef();
    return getInnerHtml(elRef);
  }
}
