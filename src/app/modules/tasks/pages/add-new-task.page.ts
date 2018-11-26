import { Component } from '@angular/core';
import { fetchWidgets, OriginPage } from '../actions/task.actions';
import { AppState } from '../../../app.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addTask } from '../../projects/actions/project.actions';
import { path } from 'ramda';
import { Project } from '../../../models/projects/board.model';
import { Task, Widget } from '../../../models/tasks/task.model';
import { Modal, ModalController } from 'ionic-angular';
import { TaskPage } from './task.page';

@Component({
  selector: 'page-add-new-task',
  templateUrl: 'add-new-task.page.html',
  styles: [ 'add-new-task.page.scss' ],
})
export class AddNewTaskPage {
  public lastTasks: Task[];
  public projects: Project[];
  public swimlanes: any[];
  public stages: any[];
  public isFormSent = false;
  public selectPopoverOpts = {
    cssClass: 'add-new-task-select',
  }

  private taskForm: FormGroup;

  private killer$: Subject<any> = new Subject();

  constructor(private store: Store<AppState>, private fb: FormBuilder,
              private modalCtrl: ModalController) { }

  public ionViewWillEnter(): void {
    this.selectFromStore('task', 'fetchWidgets', 'value')
      .takeUntil(this.killer$)
      .subscribe((res: Widget) => {
        this.lastTasks = res.cards;
        this.projects = res.projects;
      });
  }

  public ionViewWillLeave(): void {
    this.taskForm.reset();
    this.isFormSent = false;
  }

  public ngOnInit(): void {
    this.createForm();
  }

  public ngOnDestroy(): void {
    this.killer$.next();
  }

  public addTask(): void {
    this.isFormSent = true;
    if (this.taskForm.valid) {
      const payload = this.taskForm.value;

      this.store.dispatch(addTask(payload));
      this.taskForm.reset();
      this.isFormSent = false;
    }
  }

  public openTask(taskId: number, projectId: number): void {
    const origin: OriginPage = 'AddNewTaskPage';
    const taskParams = { taskId, projectId, origin };
    const modal: Modal = this.modalCtrl.create(TaskPage, { taskParams });
    modal.present();
  }

  public updateProject(): void {
    const currentProject: any = this.projects.find(project => project.id === this.taskForm.get('projectId').value);

    if (currentProject) {
      this.swimlanes = currentProject.swimlanes;
      this.stages = currentProject.stages;
    }

    this.taskForm.patchValue({
      swimlaneId: '',
      stageId: path([0, 'id'], this.stages),
    });
  }

  private createForm(): void {
    this.taskForm = this.fb.group({
      name: [ '', Validators.required ],
      description: '',
      projectId: [ '', Validators.required ],
      swimlaneId: '',
      stageId: [ '', Validators.required ],
    });
  }

  private selectFromStore <T>(...route: string[]): Observable<T> {
    return this.store.select<T>(...route)
      .filter(v => v != null);
  }
}
