import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { fetchDashboardCards, PopoverState, savePopoverState } from '../actions/task.actions';
import { AppState } from '../../../app.reducer';
import { Store } from '@ngrx/store';
import { User } from '../../user/actions/user.actions';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'page-tasks-popover',
  templateUrl: 'tasks-popover.page.html',
})
export class TasksPopoverPage {
  public dashboardUsers: User[] = [];

  private currentPage: string;
  private selectedUserId: number;
  private killer$: Subject<null> = new Subject();

  constructor(
    private viewCtrl: ViewController,
    private store: Store<AppState>
  ) { }

  public ionViewWillEnter() {
    this.selectFromStore<User[]>('task', 'fetchDashboardUsers', 'value')
      .takeUntil(this.killer$)
      .subscribe((dashboardUsers: User[]) => this.dashboardUsers = dashboardUsers);

    this.selectFromStore<PopoverState>('task', 'savePopoverState', 'value')
      .takeUntil(this.killer$)
      .subscribe((popover: PopoverState) => {
        this.currentPage = popover.page;
        this.selectedUserId = popover.userId;
      });
  }

  public ionViewWillLeave(): void {
    this.killer$.next();
  }

  public closeSelect(): void {
    setTimeout(this.viewCtrl.dismiss.bind(this.viewCtrl));
  }

  // This method enables to close popup once there is no item selected and user clicks ok anyway
  public isUserSelected(): void {
    if (this.selectedUserId == null) {
      this.closeSelect();
    }
  }

  public selectTaskUser(): void {
    this.store.dispatch(savePopoverState({
      userId: this.selectedUserId,
      page: this.currentPage,
    }));

    this.store.dispatch(fetchDashboardCards(this.selectedUserId));
    setTimeout(this.viewCtrl.dismiss.bind(this.viewCtrl));
  }

  public sortByDueDate(): void {
    this.store.dispatch(savePopoverState({
      userId: this.selectedUserId,
      page: 'TasksByDatePage',
    }));
    this.viewCtrl.dismiss();
  }

  public sortByProjects(): void {
    this.store.dispatch(savePopoverState({
      userId: this.selectedUserId,
      page: 'TasksByProjectPage',
    }));
    this.viewCtrl.dismiss();
  }

  private selectFromStore <T>(...path: string[]): Observable<T> {
    return this.store.select<T>(...path)
      .filter(v => v != null);
  }
}
