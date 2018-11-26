import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/concatMap';

import { HttpInterceptor, ServerError } from './../../../providers/http.interceptor';
import { TasksResponse, TasksPayload, Task } from './../../../models/tasks/task.model';
import {
  updateProjectsInviteeSuccess, updateProjectsInviteeError, removeProjectsInviteeSuccess,
  removeProjectsInviteeError, UPDATE_PROJECTS_INVITEE, REMOVE_PROJECTS_INVITEE,
  UPDATE_PROJECT, updateProjectSuccess, updateProjectError,
  ProjectData, ProjectLocator, TasksLocator, StageLocator, DroppedTaskLocator,
  ADD_STAGE, REMOVE_STAGE, UPDATE_STAGE_NAME, LOAD_MORE_TASKS, FETCH_PROJECTS,
  ARCHIVE_PROJECT, DELETE_PROJECT, CREATE_PROJECT, FETCH_PROJECT, TASK_DROPPED,
  AddStageSuccess, addStageSuccess, addStageError,
  removeStageSuccess, removeStageError,
  updateStageNameSuccess, updateStageNameError,
  FetchProjectSuccess, fetchProjectSuccess, fetchProjectError,
  LoadMoreTasksSuccess, loadMoreTasksSuccess, loadMoreTasksError,
  FetchProjectsSuccess, fetchProjectsSuccess, fetchProjectsError,
  archiveProjectSuccess, archiveProjectError,
  deleteProjectSuccess, deleteProjectError,
  createProjectSuccess, createProjectError,
  TaskDropped, TaskDroppedSuccess, TaskDroppedError, taskDroppedSuccess, taskDroppedError,
  removeFromFetchedProjects, ADD_TASK, NewTask, addTaskSuccess, addTaskError, AddTaskError,
  AddTaskSuccess, AddTask, DELETE_TASK_FROM_PROJECT, DeleteTaskFromProject,
  deleteTaskFromProjectSuccess, deleteTaskFromProjectError, DeleteTaskFromProjectSuccess,
} from '../actions/project.actions';
import { addNewTaskToWidgets, TaskParams } from './../../tasks/actions/task.actions';
import { Stage } from './../../../models/projects/stage.model';
import { Board } from './../../../models/projects/board.model';
import { ProjectDetails } from './../../../models/projects/project-details.model';

@Injectable()
export class ProjectEffects {
  @Effect() public addStage$ = this.actions$
    .ofType(ADD_STAGE)
    .map(toPayload)
    .switchMap(this.addStage.bind(this));

  @Effect() public removeStage$ = this.actions$
    .ofType(REMOVE_STAGE)
    .map(toPayload)
    .switchMap(this.removeStage.bind(this));

  @Effect() public updateStageName$ = this.actions$
    .ofType(UPDATE_STAGE_NAME)
    .map(toPayload)
    .switchMap(this.updateStageName.bind(this));

  @Effect() public loadMoreTasks$ = this.actions$
    .ofType(LOAD_MORE_TASKS)
    .map(toPayload)
    .switchMap(this.loadMoreTasks.bind(this));

  @Effect() public fetchProject$ = this.actions$
    .ofType(FETCH_PROJECT)
    .map(toPayload)
    .switchMap(this.fetchProject.bind(this));

  @Effect() public fetchProjects$ = this.actions$
    .ofType(FETCH_PROJECTS)
    .switchMap(this.fetchProjects.bind(this));

  @Effect() public archiveProject$ = this.actions$
    .ofType(ARCHIVE_PROJECT)
    .map(toPayload)
    .switchMap(this.archiveProjects.bind(this));

  @Effect() public deleteProject$ = this.actions$
    .ofType(DELETE_PROJECT)
    .map(toPayload)
    .switchMap(this.deleteProjects.bind(this));

  @Effect() public createProject$ = this.actions$
    .ofType(CREATE_PROJECT)
    .map(toPayload)
    .switchMap(this.createProject.bind(this));

  @Effect() public updateProject$ = this.actions$
    .ofType(UPDATE_PROJECT)
    .map(toPayload)
    .switchMap(this.updateProject.bind(this));

  @Effect() public updateProjectsInvitee$ = this.actions$
    .ofType(UPDATE_PROJECTS_INVITEE)
    .map(toPayload)
    .switchMap(this.updateProjectsInvitee.bind(this));

  @Effect() public removeProjectsInvitee$ = this.actions$
    .ofType(REMOVE_PROJECTS_INVITEE)
    .map(toPayload)
    .switchMap(this.removeProjectsInvitee.bind(this));

  @Effect() public taskDropped$ = this.actions$
    .ofType(TASK_DROPPED)
    .map<TaskDropped, DroppedTaskLocator>(toPayload)
    .switchMap(this.taskDropped.bind(this));

  @Effect() public addTask$ = this.actions$
    .ofType(ADD_TASK)
    .map<AddTask, NewTask>(toPayload)
    .switchMap(this.addTask.bind(this));

  @Effect() public deleteTaskFromProject$ = this.actions$
    .ofType(DELETE_TASK_FROM_PROJECT)
    .map<DeleteTaskFromProject, TaskParams>(toPayload)
    .switchMap(this.deleteTaskFromProject.bind(this));

  constructor(private actions$: Actions, private http: HttpInterceptor) {}

  private addStage(projectId: number): Observable<Action> {
    const data = { name: 'Untitled', project_id: projectId };
    return this.http.post<Stage>(`/projects/${projectId}/stages`, data)
      .map<Stage, AddStageSuccess>(addStageSuccess)
      .catch((error: ServerError) => Observable.of(addStageError(error)));
  }

  private removeStage(stageLocator: StageLocator): Observable<Action> {
    return this.http.delete(`/projects/${stageLocator.projectId}/stages/${stageLocator.stageId}`)
      .map(() => removeStageSuccess(stageLocator))
      .catch((error: ServerError) => Observable.of(removeStageError(error)));
  }

  private updateStageName(stageLocator: StageLocator): Observable<Action> {
    const url: string = `/projects/${stageLocator.projectId}/stages/${stageLocator.stageId}`;
    return this.http.put(url, { name: stageLocator.stageName })
      .map(() => updateStageNameSuccess(stageLocator))
      .catch((error: ServerError) => Observable.of(updateStageNameError(error)));
  }

  private loadMoreTasks(tasksLocator: TasksLocator): Observable<Action> {
    const queryParams = { params: { swimlane_id: tasksLocator.swimlaneId, page: tasksLocator.page } };
    const url = `/projects/${tasksLocator.projectId}/stages/${tasksLocator.stageId}`;
    return this.http.get(url, queryParams)
      .map<TasksResponse, TasksPayload>(res => ({
        ...res,
        swimlaneId: tasksLocator.swimlaneId,
        stageId: tasksLocator.stageId,
      }))
      .map<TasksPayload, LoadMoreTasksSuccess>(loadMoreTasksSuccess)
      .catch((error: ServerError) => Observable.of(loadMoreTasksError(error)));
  }

  private fetchProject(id: number): Observable<Action> {
    return this.http.get(`/projects/${id}`, { params: { swimlanes: true } })
      .map<ProjectDetails, FetchProjectSuccess>(fetchProjectSuccess)
      .catch((error: ServerError) => Observable.of(fetchProjectError(error)));
  }

  private fetchProjects(): Observable<Action> {
    return this.http.get('/projects', { params: { page: 1 } })
      .map<Board[], FetchProjectsSuccess>(fetchProjectsSuccess)
      .catch((error: ServerError) => Observable.of(fetchProjectsError(error)));
  }

  private archiveProjects(locator: ProjectLocator): Observable<Action> {
    return this.http.get(`/projects/${locator.projectId}/archive`)
      .concatMap(() =>
        Observable.from([
          removeFromFetchedProjects(locator),
          archiveProjectSuccess(locator),
        ])
      )
      .catch((error: ServerError) => Observable.of(archiveProjectError(error)));
  }

  private deleteProjects(locator: ProjectLocator): Observable<Action> {
    return this.http.delete(`/projects/${locator.projectId}`)
      .concatMap(() =>
        Observable.from([
          removeFromFetchedProjects(locator),
          deleteProjectSuccess(locator),
        ])
      )
      .catch((error: ServerError) => Observable.of(deleteProjectError(error)));
  }

  private createProject(inputPayload: ProjectData): Observable<Action> {
    return this.http.post('projects', inputPayload)
      .map((serverPayload) => createProjectSuccess({ inputPayload, serverPayload }))
      .catch((error: ServerError) => Observable.of(createProjectError(error)));
  }

  private updateProject(payload: ProjectData): Observable<Action> {
    return this.http.put(`projects/${payload.id}`, { name: payload.name, workspace_id: payload.workspace_id })
      .map(() => updateProjectSuccess(payload))
      .catch((error: ServerError) => Observable.of(updateProjectError(error)));
  }

  private updateProjectsInvitee(payload: ProjectData): Observable<Action> {
    return this.http.post(`projects/${payload.id}/people`, { id: payload.id, invitees: payload.invitees })
      .map(() => updateProjectsInviteeSuccess(payload))
      .catch((error: ServerError) => Observable.of(updateProjectsInviteeError(error)));
  }

  private removeProjectsInvitee(payload): Observable<Action> {
    return this.http.delete(`projects/${payload.projectId}/people/${payload.userId}`)
      .map(() => removeProjectsInviteeSuccess(payload))
      .catch((error: ServerError) => Observable.of(removeProjectsInviteeError(error)));
  }

  private taskDropped(idsObject: DroppedTaskLocator): Observable<TaskDroppedSuccess|TaskDroppedError> {
    const payload = {
      project_id: idsObject.projectId,
      card_id: idsObject.taskId,
      swimlane_id: idsObject.to.swimlaneId,
    };
    const params = {
      prev_id: idsObject.prevTaskId,
      stage_id: idsObject.to.stageId,
      swimlane_id: idsObject.to.swimlaneId,
    };
    const url = `/projects/${idsObject.projectId}/cards/${idsObject.taskId}/move`;

    return this.http.post(url, payload, { params })
      .map<any, TaskDroppedSuccess>(() => taskDroppedSuccess(idsObject))
      .catch((error: ServerError): Observable<TaskDroppedError> => Observable.of(taskDroppedError(error)));
  }

  private addTask(newTask: NewTask): Observable<AddTaskSuccess|AddTaskError> {
    const addLast = newTask.addLast;
    const url = `/projects/${newTask.projectId}/cards`;
    const params = { stage_id: newTask.stageId, swimlane_id: newTask.swimlaneId, is_pad: addLast };
    const addTaskSuccess$: Observable<AddTaskSuccess> = Observable.of(addTaskSuccess(newTask));

    const dispatchActions = (res) => {
      return Observable.from([
        addTaskSuccess({ ...res, addLast }),
        addNewTaskToWidgets(res),
      ]);
    };

    const request$ = this.http.post(url, { name: newTask.name, description: newTask.description }, { params })
      .concatMap<Task, AddTaskSuccess>(dispatchActions)
      .catch((error: ServerError): Observable<AddTaskError> => Observable.of(addTaskError(error)));

    return addTaskSuccess$.concat(request$);
  }

  private deleteTaskFromProject(taskParams: TaskParams) {
    return this.http.delete(`/projects/${taskParams.projectId}/cards/${taskParams.taskId}`)
      .map<any, DeleteTaskFromProjectSuccess>(() => deleteTaskFromProjectSuccess(taskParams))
      .catch((error: ServerError) => Observable.of(deleteTaskFromProjectError(error)));
  }
}
