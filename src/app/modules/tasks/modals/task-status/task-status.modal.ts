import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { ViewController } from "ionic-angular";
import { Subject } from "rxjs/";

import { AppState } from "./../../../../app.reducer";
import { updateStatus } from "./../../actions/task.actions";
import { Task, TaskStatuses } from "./../../../../models/tasks/task.model";
import { isDefined } from "./../../../../helpers/path-is-defined";
import { clone } from "ramda";

@Component({
  selector: "modal-task-status",
  templateUrl: "task-status.modal.html",
  styles: ["task-status.modal.scss"]
})
export class TaskStatusModal {
  public selectedStatus: TaskStatuses = {
    id: null,
    color: null,
    name: null
  };

  private killer$: Subject<any> = new Subject();

  private task: Task;

  constructor(
    private store: Store<AppState>,
    private viewCtrl: ViewController
  ) {}

  public ionViewWillLoad(): void {
    this.getTask();
  }

  public ionViewWillUnload(): void {
    this.killer$.next();
  }

  public dismiss(): void {
    this.updateTaskStatus();
    this.viewCtrl.dismiss();
  }

  public selectStatusOnList(status: any) {
    if (status.id == this.selectedStatus.id) {
      this.selectedStatus = {
        id: null,
        color: null,
        name: null
      };
    } else {
      this.selectedStatus = status;
    }
  }

  private getTask(): void {
    this.store
      .select<Task>("task", "fetchTask", "value")
      .takeUntil(this.killer$)
      .filter(isDefined)
      .subscribe(task => {
        this.task = clone(task);
        this.selectedStatus.id = task.status_id;
      });
  }

  private updateTaskStatus(): void {
    if (this.statusIdChanged) {
      this.store.dispatch(
        updateStatus({
          ...this.task,
          status_id: this.selectedStatus.id,
          status_color: this.selectedStatus.color,
          status_name: this.selectedStatus.name,
          status_short: null,
          status_code: null,
          done: null,
          ready: null,
          onhold: null,
          blocked: null
        })
      );
    }
  }

  private get statusIdChanged(): boolean {
    return this.selectedStatus.id !== this.task.status_id;
  }
}