import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { isDefined } from '../../../../helpers/path-is-defined';
import { Task } from '../../../../models/tasks/task.model';
import { AppState } from '../../../../app.reducer';
import { Store } from '@ngrx/store';
import { updateUsers } from '../../actions/task.actions';
import { clone } from 'ramda';

@Component({
  selector: 'modal-task-users',
  templateUrl: 'task-users.modal.html',
  styles: [ 'task-users.modal.scss' ],
})
export class TaskUsersModal {
  private killer$: Subject<any> = new Subject();
  private task: Task;
  private taskUsers: any[];

  constructor(
    private store: Store<AppState>,
    private viewCtrl: ViewController) {
  }

  public ionViewWillLoad(): void {
    this.getUsers();
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

  public onUserSelect(): void {
    this.store.dispatch(updateUsers(this.task));
  }

  private getUsers(): void {
    this.store.select<Task>('task', 'fetchTask', 'value')
      .takeUntil(this.killer$)
      .filter(isDefined)
      .subscribe((task) => {
        this.task = clone(task);
        this.taskUsers = this.task.users;
      });
  }
}
