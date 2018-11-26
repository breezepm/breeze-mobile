import { Component, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ViewController } from 'ionic-angular';
import { Subject } from 'rxjs/';
import { merge, pick, props, not, all, isEmpty } from 'ramda';

import { AppState } from './../../../../app.reducer';
import { Task } from './../../../../models/tasks/task.model';
import { updateDates } from './../../actions/task.actions';
import { isDefined } from './../../../../helpers/path-is-defined';
import { TaskDates } from '../../../../models/tasks/task-date.model';

@Component({
  selector: 'modal-task-dates',
  templateUrl: 'task-dates.modal.html',
  styles: [ 'task-dates.modal.scss' ],
})
export class TaskDatesModal {

  @ViewChild('startDate') public startDate;
  @ViewChild('endDate') public endDate;

  public dates;

  public maxDate = '2099-01-01';

  private isPrevStartDateEmpty: boolean;

  private isPrevDueDateEmpty: boolean;

  private killer$: Subject<any> = new Subject();

  private task: Task;

  private timeoutHolder: any;

  constructor(private store: Store<AppState>, private viewCtrl: ViewController) {}

  public openStart() {
    this.isPrevStartDateEmpty = !this.dates.startdate;

    if (!this.dates.startdate) {
      this.dates.startdate = new Date().toJSON().split('T')[0];
      this.timeoutHolder = setTimeout(() => {
        this.startDate.open();
      }, 50);
    } else {
      this.startDate.open();
    }
  }

  public openEnd() {
    this.isPrevDueDateEmpty = !this.dates.duedate;

    if (!this.dates.duedate) {
      this.dates.duedate = new Date().toJSON().split('T')[0];
      this.timeoutHolder = setTimeout(() => {
        this.endDate.open();
      }, 50);
    } else {
      this.endDate.open();
    }
  }

  public ionViewWillLoad(): void {
    this.getTask();
  }

  public ionViewWillUnload(): void {
    this.killer$.next();
    clearTimeout(this.timeoutHolder);
  }

  public clearDateModel(dateType: string): void {
    if (dateType === 'duedate' && this.isPrevDueDateEmpty) {
      this.dates.duedate = '';
    }
    if (dateType === 'startdate' && this.isPrevStartDateEmpty) {
      this.dates.startdate = '';
    }
  }

  public dismiss(): void {
    this.updateDates();
    this.viewCtrl.dismiss();
  }

  public printStartdateOrInfo() {
    return this.dates.startdate === null ? '' : this.dates.startdate;
  }

  public printEnddateOrInfo() {
    return this.dates.duedate === null ? '' : this.dates.duedate;
  }

  public updateDates(): void {
    const dates = props(['startdate', 'duedate'], this.dates);
    if (not(all(isEmpty, dates))) {
      const action = updateDates(merge(this.task, this.dates));
      this.store.dispatch(action);
    }
  }

  public resetDate(startOrDue: string): void {
    if (startOrDue === 'start') {
      this.dates.startdate = '';
    }

    if (startOrDue === 'due') {
      this.dates.duedate = '';
    }
  }

  private getTask(): void {
    this.store.select<Task>('task', 'fetchTask', 'value')
      .takeUntil(this.killer$)
      .filter(isDefined)
      .subscribe((task) => {
        this.task = task;
        this.dates = pick(['startdate', 'duedate'], task);
      });
  }
}
