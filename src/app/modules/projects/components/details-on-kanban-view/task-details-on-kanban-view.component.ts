import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { sortByNameUpToTen } from '../../../../helpers/sort-by-name-up-to-ten';
import { isEmpty } from 'ramda';
import { AppState } from '../../../../app.reducer';
import { Task } from '../../../../models/tasks/task.model';

@Component({
  selector: 'task-details-on-kanban-view',
  templateUrl: 'task-details-on-kanban-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TaskDetailsOnKanbanViewComponent {
  @Input() public card: Task;

  public showTaskId$ = this.store.select<boolean>('project', 'fetchProject', 'value', 'show_task_ids');

  constructor(private store: Store<AppState>) {}

  public getAssignedUsers(users = []) {
    return sortByNameUpToTen(users);
  }

  public isArrayEmpty(arr) {
    return isEmpty(arr);
  }

  public showCardStatus() {
    return this.card.status_name;
  }
}
