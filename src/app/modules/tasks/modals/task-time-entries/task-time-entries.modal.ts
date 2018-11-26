import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { isDefined } from '../../../../helpers/path-is-defined';
import { Task, TaskTimeEntries, TimeEntryParams } from '../../../../models/tasks/task.model';
import { AppState } from '../../../../app.reducer';
import { Store } from '@ngrx/store';
import { clone } from 'ramda';
import { addTimeEntry, removeTimeEntry } from '../../actions/task.actions';
import { parseMinutes } from '../../../../helpers/parse-minutes';
import { User } from '../../../user/actions/user.actions';

@Component({
  selector: 'modal-task-time-entries',
  templateUrl: 'task-time-entries.modal.html',
  styles: [ 'task-time-entries.modal.scss' ],
})
export class TaskTimeEntriesModal {
  public currentUser: User;
  public timeEntries: TaskTimeEntries[] = [];
  public tracked: string;
  public focused: boolean;

  private killer$: Subject<any> = new Subject();
  private task: Task;

  constructor(
    private store: Store<AppState>,
    private viewCtrl: ViewController) {
  }

  public ionViewWillLoad(): void {
    this.fetchCurrentUser();
    this.getTimeEntries();
    this.watchForAddEntrySuccess();
  }

  public ionViewWillUnload(): void {
    this.killer$.next();
  }

  public dismiss(): void {
    this.viewCtrl.dismiss();
  }

  public trackById(_, item): number {
    if (item != null) {
      return item.id;
    }
  }

  public onFocusIn(): void {
    this.focused = true;
  }

  public addEntry(evt: KeyboardEvent): void {
    const IS_MOUSE_CLICK_EVENT: boolean = evt.type === 'click';
    const IS_KEYBOARD_EVENT: boolean = evt.type.toLocaleLowerCase() === 'keyup';
    const IS_ENTER_KEY: boolean = evt.keyCode === 13;

    if ((IS_KEYBOARD_EVENT && IS_ENTER_KEY) || IS_MOUSE_CLICK_EVENT) {
      const params: TimeEntryParams = {
        ...this.commonTaskAttributes,
        tracked: parseMinutes(this.tracked, 1),
      };

      if (params.tracked) {
        this.store.dispatch(addTimeEntry(params));
      }
    } else if (!IS_KEYBOARD_EVENT) {
      this.focused = false;
    }
  }

  public deleteEntry(entry): void {
    const params: TimeEntryParams = {
      ...this.commonTaskAttributes,
      entryId: entry.id,
      tracked: entry.tracked,
    };

    this.store.dispatch(removeTimeEntry(params));
  }

  private get commonTaskAttributes(): TimeEntryParams {
    return ({
      taskId: this.task.card_id,
      projectId: this.task.project_id,
      task: this.task,
    });
  }

  private fetchCurrentUser(): void {
    this.store.select<User>('user', 'fetchCurrentUser', 'value')
      .filter(user => user != null)
      .takeUntil(this.killer$)
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  private getTimeEntries(): void {
    this.store.select<Task>('task', 'fetchTask', 'value')
      .takeUntil(this.killer$)
      .filter(isDefined)
      .subscribe((task) => {
        this.task = clone(task);
        this.timeEntries = [ ...this.task.time_entries ];
      });
  }

  private watchForAddEntrySuccess(): void {
    this.store.select<boolean>('task', 'addTimeEntry', 'success')
      .takeUntil(this.killer$)
      .filter(Boolean)
      .subscribe(() => this.tracked = '');
  }
}
