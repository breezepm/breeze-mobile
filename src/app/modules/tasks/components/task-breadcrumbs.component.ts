import { Component, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { Task } from '../../../models/tasks/task.model';

@Component({
  selector: 'task-breadcrumbs',
  templateUrl: 'task-breadcrumbs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TaskBreadcrumbsComponent implements OnChanges {
  @Input() public card: Task;
  public breadcrumbs: string;

  public ngOnChanges(): void {
    this.setBreadcrumbs();
  }

  public setBreadcrumbs(): void {
    const cardName = this.card.card_name ? '> ' + this.card.card_name : '';
    this.breadcrumbs =  `${this.card.project.name} > ${this.card.stage.name} ${cardName}`;
  }

}
