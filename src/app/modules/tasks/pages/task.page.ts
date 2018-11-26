import {
  Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef,
  ViewChild, ViewContainerRef,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  ViewController, ModalController, NavController,
  ActionSheetController, TextInput, Platform,
  PopoverController
} from 'ionic-angular';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/';
import 'rxjs/add/operator/takeUntil';
import { path, clone, contains, pick } from 'ramda';
import { AppState } from './../../../app.reducer';
import { Task } from './../../../models/tasks/task.model';
import { User } from './../../../models/user/user-credentials.model';
import {
  FetchedComment, CommentParams, CommentActionType,
  Commenter
} from './../../../models/task-comment/task-comment.model';
import { addComment, removeComment, fetchComments } from './../actions/task-comment.actions';
import {
  fetchTask, TaskParams, updateName,
  deleteTaskLayoutDueDate, deleteTaskLayoutProject, fetchWidgets,
} from './../actions/task.actions';
import { deleteTaskFromProject, fetchProject } from './../../projects/actions/project.actions';
import { deleteTaskFromActivity } from './../../activity/actions/activity.actions';
import { sortByNameUpToTen } from './../../../helpers/sort-by-name-up-to-ten';
import { isEnterKeyOrBlurEvent } from './../../../helpers/is-enter-key-or-blur-event';
import { getTaskStatusName } from './../../../helpers/get-task-status';
import {
  TaskStageModal, TaskCommentModal, TaskAttachmentsModal,
  TaskStatusModal, TaskTodosModal, TaskDatesModal, TaskUsersModal,
  TaskDescriptionModal,
} from './../modals';
import { TaskTimeEntriesModal } from '../modals/task-time-entries/task-time-entries.modal';
import { Keyboard } from '@ionic-native/keyboard';
import { isEnter } from './../../../helpers/isEnter';
import { parseUsersToMentionNamesAndIds } from '../../../helpers/parse-users-to-mention-names-and-ids';
import { isDefined } from '../../../helpers/path-is-defined';
import { getInnerHtml } from '../../../helpers/get-inner-html';
import { TaskPopoverPage } from './task-popover.page';

const ALL_USERS_ID = -999;

@Component({
  selector: 'page-task',
  templateUrl: 'task.page.html',
  styles: [ 'task.page.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskPage implements OnInit, OnDestroy {
  public task: Task;
  public taskNameForm: FormGroup;
  public currentUser: User;
  public assignedUsers: any[];
  public comments: FetchedComment[];
  public taskUsers: Commenter[];
  public initialAddCommentHtml = null;
  public keyboardHeight = 0;
  public showTaskId$ = this.store.select<boolean>('task', 'fetchTask', 'value', 'project')
    .filter(Boolean)
    .pluck('show_task_ids');
  public taskPageSaveEvent = false;

  @ViewChild('textInput') private textInputRef: TextInput;

  private killer$: Subject<any> = new Subject();
  private prevTaskName: string;
  private mentionedNames: string[] = [];
  private currentMentionNames: string[] = [];
  private viewHeight: number;

  constructor(
    public platform: Platform,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private navCtrl: NavController,
    private keyboard: Keyboard,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private detector: ChangeDetectorRef,
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef,
    private popoverCtrl: PopoverController
  ) {}

  public ngOnInit(): void {
    this.createTaskNameForm();
    this.fetchTask();
    this.fetchCurrentUser();
    this.fetchComments();
    this.touchBlocking();
    this.keyboard.disableScroll(true);
  }

  public ionViewDidLoad() {
    this.viewHeight = path<number>(['element', 'nativeElement', 'offsetHeight'], this.viewContainerRef);
    this.resizeAreaUnderKeyboard();
  }

  public ngOnDestroy(): void {
    this.killer$.next();
    this.removeTouchBlocking();
  }

  public openPopover(ev: Event): void {
    const popover = this.popoverCtrl
      .create(TaskPopoverPage, pick([ 'taskParams', 'task', 'currentUser' ], this));

    popover.present({ ev });
    popover.onDidDismiss((closeParent: boolean) => {
      if (closeParent) {
        this.viewCtrl.dismiss();
      }
    });
  }

  public dismiss(): void {
    this.store.dispatch(fetchWidgets());
    this.viewCtrl.dismiss();
  }

  public getPrevTaskName(): void {
    this.prevTaskName = this.taskNameForm.value.name;
  }

  public preventNextLine(event: KeyboardEvent) {
    if (isEnter(event)) {
      event.stopPropagation();
      event.preventDefault();
      return true;
    }
  }

  public updateTaskName(evt: KeyboardEvent): void {
    if (isEnterKeyOrBlurEvent(evt)) {
      this.postTaskName(this.taskNameForm.value.name);
      this.keyboard.close();
    }
  }

  public saveComment(evt: KeyboardEvent): void {
    this.taskPageSaveEvent = false;
    if (isEnterKeyOrBlurEvent(evt)) {
      this.checkIfCurrentMentionsExistInTextArea();
      this.postComment(this.commentContent);
      this.keyboard.close();
      this.taskPageSaveEvent = true;
    }
  }

  public trackById(_, item): number {
    if (item != null) {
      return item.id;
    }
  }

  public openTaskDescriptionModal(): void {
    if (!this.currentUser.observer) {
      this.modalCtrl.create(TaskDescriptionModal).present();
    }
  }

  public openTaskStageModal(): void {
    if (path<boolean>(['current_user', 'observer_move'], this.task)) {
      this.getOwnerProject();
      this.modalCtrl.create(TaskStageModal, this.taskParams).present();
    }
  }

  public addMentionIdToArray(userName: string) {
    if (!contains( userName, this.mentionedNames)) {
      this.mentionedNames.push(userName);
    }
    this.checkIfCurrentMentionsExistInTextArea();
  }

  public openTaskStatusModal(): void {
    this.modalCtrl.create(TaskStatusModal, {task: {...this.task}}).present();
  }

  public openTaskTodosModal(): void {
    this.modalCtrl.create(TaskTodosModal).present();
  }

  public openTaskUsersModal(): void {
    this.modalCtrl.create(TaskUsersModal).present();
  }

  public openTaskDatesModal(): void {
    this.modalCtrl.create(TaskDatesModal).present();
  }

  public openTaskTimeEntriesModal(): void {
    this.modalCtrl.create(TaskTimeEntriesModal).present();
  }

  public openTaskAttachmentsModal(): void {
    this.modalCtrl
      .create(TaskAttachmentsModal, {
        taskId: this.task.id,
        projectId: this.task.project_id,
        stageId: this.task.stage_id,
        swimlaneId: this.task.swimlane_id,
        dueDateBlock: this.task.duedate_block,
      })
      .present();
  }

  public openTaskCommentModal(comment: any): void {
    if (comment != null && this.isCommentOwner(comment.user.id)) {
      this.modalCtrl
        .create(TaskCommentModal, { commentId: comment.id, task: this.task }, { showBackdrop: false })
        .present();
    }
  }

  public deleteComment(commentId: number, event) {
    event.preventDefault();
    const type: CommentActionType = 'remove';
    const commentParams: CommentParams = {
      projectId: this.taskParams.projectId,
      taskId: this.taskParams.taskId,
      stageId: this.taskParams.stageId,
      swimlaneId: this.taskParams.swimlaneId,
      dueDateBlock: this.taskParams.dueDateBlock,
      commentId,
      type,
    };
    this.store.dispatch(removeComment(commentParams));
  }

  public isCommentOwner(userId: number): boolean {
    return userId === this.currentUser.id;
  }

  public get showTodosBadge(): boolean {
    return this.task.done_todos > 0 || this.task.todos_count > 0;
  }

  public get todosBadgeText(): string {
    return `${this.task.done_todos} / ${this.task.todos_count}`;
  }

  public get userCanSeeEstimates(): boolean {
    return this.currentUser.can_see_estimates && this.currentUser.can_see_timetracking;
  }

  public get startAndDueDate(): string {
    const startDate = this.task.startdate;
    const dueDate = this.task.duedate;

    const transformedStartDate = !startDate ? '' : this.datePipe.transform(new Date(startDate), 'MMM d');
    const transformedDueDate = !dueDate ? '' : this.datePipe.transform(new Date(dueDate), 'MMM d');

    if (transformedStartDate !== '' || transformedDueDate !== '') {
      return `${transformedStartDate} - ${transformedDueDate}`;
    }

    return '';
  }

  public get taskStatus(): string {
    return this.task.status_name || 'Status';
  }

  private removeTouchBlocking() {
    const element = this.elementRef.nativeElement;
    element.removeEventListener('touchend');
    element.removeEventListener('touchstart');
    element.removeEventListener('touchmove');
  }

  private touchBlocking() {
    const element = this.elementRef.nativeElement;

    element.addEventListener('touchend', (event) => {
      event.stopPropagation();
    });

    element.addEventListener('touchstart', (event) => {
      event.stopPropagation();
    });

    element.addEventListener('touchmove', (event) => {
      event.stopPropagation();
    });
  }

  private resizeAreaUnderKeyboard() {
    this.keyboard.onKeyboardShow().takeUntil(this.killer$).subscribe((event) => {
      this.keyboardHeight = event.keyboardHeight + 20;
      this.detector.markForCheck();
    });

    this.keyboard.onKeyboardHide().takeUntil(this.killer$).subscribe((event) => {
      this.keyboardHeight = 0;
      this.detector.markForCheck();
    });
  }

  private createTaskNameForm(): void {
    this.taskNameForm = this.fb.group({ name: [''] });
  }

  private fetchTask(): void {
    this.store.dispatch(fetchTask(this.taskParams));

    this.store.select<Task>('task', 'fetchTask', 'value')
      .filter(task => task != null)
      .takeUntil(this.killer$)
      .subscribe((task) => {
        this.task = task;
        this.assignedUsers = sortByNameUpToTen(task.users);
        this.taskNameForm.setValue({ name: task.name });
        this.fetchTaskUsers();
        this.detector.markForCheck();
      });
  }

  private fetchCurrentUser(): void {
    this.store.select<User>('user', 'fetchCurrentUser', 'value')
      .filter(user => user != null)
      .takeUntil(this.killer$)
      .subscribe(user => {
        this.currentUser = user;
        this.detector.markForCheck();
      });
  }

  private fetchComments(): void {
    const commentParams: CommentParams = {
      projectId: this.taskParams.projectId,
      taskId: this.taskParams.taskId,
    };
    this.store.dispatch(fetchComments(commentParams));

    this.store.select<FetchedComment[]>('taskComment', 'fetchComments', 'value')
      .filter(task => task != null)
      .takeUntil(this.killer$)
      .subscribe(comments => {
        this.comments = comments;
        this.detector.markForCheck();
      });
  }

  private postTaskName(taskName: string): void {
    const name: string = taskName != null ? taskName.trim() : '';
    const taskNameChanged = name !== this.prevTaskName;
    if (name !== '' && taskNameChanged) {
      this.store.dispatch(updateName({ ...this.task, name }));
    }
  }

  private postComment(text: string): void {
    const comment: string = text != null ? text.trim() : '';
    if (comment !== '') {
      const type: CommentActionType = 'add';
      const commentParams: CommentParams = {
        type,
        comment,
        mentions: this.mentionedUsersIdsToSend,
        projectId: this.taskParams.projectId,
        taskId: this.taskParams.taskId,
        stageId: this.taskParams.stageId,
        swimlaneId: this.taskParams.swimlaneId,
        user: this.currentUser,
        dueDateBlock: this.taskParams.dueDateBlock,
      };
      this.store.dispatch(addComment(commentParams));
    }
    this.resetTextArea();
  }

  private resetTextArea() {
    this.textInputRef.getElementRef().nativeElement.innerHTML = null;
  }

  private handleDelete(): void {
    let dispatcher;
    const { origin } = this.taskParams;

    if (origin === 'ProjectPage') {
      dispatcher = deleteTaskFromProject;
    }

    if (origin === 'ActivityPage') {
      dispatcher = deleteTaskFromActivity;
    }

    if (origin === 'TasksByDatePage') {
      dispatcher = deleteTaskLayoutDueDate;
    }

    if (origin === 'TasksByProjectsPage') {
      dispatcher = deleteTaskLayoutProject;
    }

    this.store.dispatch(dispatcher(this.taskParams));
    this.navCtrl.pop();
  }

  private getOwnerProject(): void {
    this.store.dispatch(fetchProject(this.taskParams.projectId));
  }

  private fetchTaskUsers() {
    this.store.select<Commenter[]>('task', 'fetchTask', 'value', 'users')
      .takeUntil(this.killer$)
      .filter(isDefined)
      .subscribe((users) => {
        this.taskUsers = [...users, { email: 'all users', id: ALL_USERS_ID }];
      });
  }

  private checkIfCurrentMentionsExistInTextArea() {
    this.currentMentionNames = this.mentionedNames.filter(name => this.commentContent.includes(name));
  }

  private get mentionedUsersIdsToSend() {
    const taskUsersMentionNamesAndIds = parseUsersToMentionNamesAndIds(this.taskUsers);
    const mentionedUsersIds = taskUsersMentionNamesAndIds
      .filter((user: Commenter) => this.currentMentionNames.includes(user.name))
      .map(user => user.id);

    return mentionedUsersIds;
  }

  private get taskParams(): TaskParams {
    return this.viewCtrl.getNavParams().get('taskParams');
  }

  private get commentContent(): string {
    const elRef: ElementRef = this.textInputRef.getElementRef();
    return elRef.nativeElement.innerHTML;
  }
}
