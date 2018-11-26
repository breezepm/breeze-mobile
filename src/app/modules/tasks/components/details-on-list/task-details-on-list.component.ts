import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { sortByNameUpToTen } from '../../../../helpers/sort-by-name-up-to-ten';
import { defaultTo, either, isEmpty, whereEq } from 'ramda';
import { AppState } from '../../../../app.reducer';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { User } from '../../../../models/user/user-credentials.model';
import { propIsDefinedAndNotEmpty } from '../../../../helpers/prop-is-defined-and-not-empty';
import { Task } from '../../../../models/tasks/task.model';

@Component({
  selector: 'task-details-on-list',
  templateUrl: 'task-details-on-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TaskDetailsOnListComponent {
  @Input() public card: Task;
  @Input() public hasBreadcrumbs: boolean;

  public currentUser: User;

  private killer$ = new Subject<any>();

  constructor(private store: Store<AppState>) {}

  public ngOnInit(): void {
    this.fetchCurrentUser();
  }

  public ngOnDestroy(): void {
    this.killer$.next();
  }

  public getAssignedUsers(users) {
    return sortByNameUpToTen(users || []);
  }

  public isArrayEmpty(arr) {
    return isEmpty(arr);
  }

  public get canSeeEstimates(): boolean {
    const defaultToObj = defaultTo({});

    const cardIsVisible = either(
      propIsDefinedAndNotEmpty('total_tracked'),
      propIsDefinedAndNotEmpty('planned_time')
    );

    const userCanSeeTime = whereEq({
      can_see_timetracking: true,
      can_see_estimates: true,
    });

    return cardIsVisible(defaultToObj(this.card)) && userCanSeeTime(defaultToObj(this.currentUser));
  }

  private fetchCurrentUser(): void {
    this.store.select<User>('user', 'fetchCurrentUser', 'value')
      .filter(user => user != null)
      .takeUntil(this.killer$)
      .subscribe(user => {
        this.currentUser = user;
      });
  }
}
