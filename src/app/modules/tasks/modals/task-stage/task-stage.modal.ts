import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ViewController } from 'ionic-angular';
import { Subject } from 'rxjs/';
import { path, propEq, propSatisfies, pick, find } from 'ramda';

import { AppState } from './../../../../app.reducer';
import { updateStage, TaskParams } from './../../actions/task.actions';
import { Task } from './../../../../models/tasks/task.model';
import { Stage } from './../../../../models/projects/stage.model';
import { ProjectDetails } from './../../../../models/projects/project-details.model';
import { isDefined } from './../../../../helpers/path-is-defined';
import { getTaskStatusCode } from './../../../../helpers/get-task-status';

const hasSwimlanes = propSatisfies(isDefined, 'swimlanes');
const justNameAndId = pick(['name', 'id']);

@Component({
  selector: 'modal-task-stage',
  templateUrl: 'task-stage.modal.html',
  styles: [ 'task-stage.modal.scss' ],
})
export class TaskStageModal {

  public stages: Stage[];
  public selectedStageId: number;

  private killer$: Subject<any> = new Subject();
  private task: Task;
  private taskParams;

  constructor(private store: Store<AppState>, private viewCtrl: ViewController) {}

  public ionViewWillLoad(): void {
    this.assignTaskParams();
    this.getStages();
    this.getTask();
  }

  public ionViewWillUnload(): void {
    this.killer$.next();
  }

  public dismiss(): void {
    this.updateStage();
    this.viewCtrl.dismiss();
  }

  public selectStage(stageId: number): void {
    this.selectedStageId = stageId;
  }

  private updateStage(): void {
    if (this.stageIdChanged) {
      const newStage: Stage = find(propEq('id', this.selectedStageId), this.stages);

      this.store.dispatch(updateStage({
        task: {
          ...this.task,
          stage_id: newStage.id,
          stage: justNameAndId<Stage, any>(newStage),
          status_code: getTaskStatusCode(newStage.status),
          status_short: newStage.status,
        },
        params: this.taskParams,
      }));
    }
  }

  private getStages(): void {
    this.store.select<ProjectDetails>('project', 'fetchProject', 'value')
      .takeUntil(this.killer$)
      .filter(hasSwimlanes)
      .map(path<Stage[]>(['swimlanes', 0, 'stages']))
      .subscribe((stages) => {
        this.stages = stages;
      });
  }

  private getTask(): void {
    this.store.select<Task>('task', 'fetchTask', 'value')
      .takeUntil(this.killer$)
      .filter(isDefined)
      .subscribe((task) => {
        this.task = task;
        this.selectStage(task.stage_id);
      });
  }

  private get stageIdChanged(): boolean {
    return this.selectedStageId !== this.task.stage_id;
  }

  private assignTaskParams(): void {
    const paramsAttrs = ['origin', 'projectId', 'stageId', 'taskId', 'dueDateBlock'];
    this.taskParams = pick(paramsAttrs, this.viewCtrl.getNavParams().data);
  }

}
