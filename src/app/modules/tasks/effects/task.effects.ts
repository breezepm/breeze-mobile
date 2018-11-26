import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/';
import 'rxjs/add/operator/map';
import { pick, merge, omit } from 'ramda';

import {
  deleteTaskFromProjectSuccess, addTaskSuccess, updateTaskStatus,
  updateTaskTodosCount, TodoParams, TodoActionType, updateTaskDates,
  UpdateTaskDates, UpdateTaskStatus, updateTaskName, updateTaskUsers,
  updateTaskTrackedTime, updateTaskDescription, updateTaskAttachmentsCount,
  UpdateTaskAttachmentsCount,
} from './../../projects/actions/project.actions';
import {
  DashboardCard, DashboardCardByDueDate,
  DeleteTask, DeleteTaskError, DeleteTaskSuccess,
  deleteTaskLayoutDueDateError, deleteTaskLayoutDueDateSuccess,
  deleteTaskLayoutProjectError, deleteTaskLayoutProjectSuccess,
  DELETE_TASK_LAYOUT_DUE_DATE, DELETE_TASK_LAYOUT_PROJECT, ADD_ATTACHMENT, REMOVE_ATTACHMENT,
  FETCH_DASHBOARD_CARDS, FETCH_DASHBOARD_CARDS_BY_DUE_DATE, FETCH_DASHBOARD_CARDS_BY_PROJECT, FETCH_DASHBOARD_USERS,
  FETCH_TASK, LOAD_MORE_DASHBOARD_CARDS, LOAD_MORE_TASKS_PER_DUE_DATE, LOAD_MORE_TASKS_PER_STAGE,
  FetchDashboardCards, FetchDashboardCardsByDueDate, fetchDashboardCardsByDueDateError,
  fetchDashboardCardsByDueDateSuccess, FetchDashboardCardsByDueDateSuccess,
  FetchDashboardCardsByProject, AddAttachment, AddAttachmentSuccess, AddAttachmentError,
  RemoveAttachment, RemoveAttachmentSuccess, RemoveAttachmentError,
  FetchDashboardCardsByProjectError, fetchDashboardCardsByProjectError,
  FetchDashboardCardsByProjectSuccess, fetchDashboardCardsByProjectSuccess,
  fetchDashboardCardsError, fetchDashboardCardsSuccess,
  FetchDashboardCardsError, FetchDashboardCardsSuccess,
  FetchDashboardUsers, FetchTask, FetchTaskSuccess, FetchTaskError,
  fetchTaskError, fetchTaskSuccess, LoadMoreDashboardCards,
  loadMoreDashboardCardsError, LoadMoreDashboardCardsError,
  loadMoreDashboardCardsSuccess, LoadMoreDashboardCardsSuccess,
  LoadMoreTasksPerDueDate, loadMoreTasksPerDueDateError,
  LoadMoreTasksPerDueDateError, LoadMoreTasksPerDueDateModel,
  LoadMoreTasksPerDueDateSuccess, loadMoreTasksPerDueDateSuccess,
  LoadMoreTasksPerStage, LoadMoreTasksPerStageError,
  loadMoreTasksPerStageError, LoadMoreTasksPerStageSuccess,
  loadMoreTasksPerStageSuccess, Stage, TaskParams,
  FetchDashboardUsersSuccess, FetchDashboardUsersError,
  fetchDashboardUsersSuccess, fetchDashboardUsersError,
  addAttachmentSuccess, addAttachmentError, removeAttachmentSuccess, removeAttachmentError,
  defaultAction, Default, updateStageSuccess, updateStageError, UpdateStage,
  UpdateStageSuccess, UpdateStageError, UPDATE_STAGE, UpdateStageParams,
  UpdateStatus, UpdateStatusSuccess, UpdateStatusError, UPDATE_STATUS,
  updateStatusSuccess, updateStatusError, ADD_TODO_LIST, REMOVE_TODO_LIST,
  EDIT_TODO_LIST, ADD_TODO, EDIT_TODO, REMOVE_TODO, AddTodoList, AddTodoListSuccess,
  AddTodoListError, EditTodoList, EditTodoListSuccess, EditTodoListError, RemoveTodoList,
  RemoveTodoListSuccess, RemoveTodoListError, AddTodo, AddTodoSuccess, AddTodoError,
  EditTodo, EditTodoSuccess, EditTodoError, RemoveTodo, RemoveTodoSuccess, RemoveTodoError,
  addTodoListSuccess, editTodoListSuccess, removeTodoListSuccess,
  addTodoListError, editTodoListError, removeTodoListError,
  addTodoSuccess, editTodoSuccess, removeTodoSuccess,
  addTodoError, editTodoError, removeTodoError,
  updateDatesSuccess, updateDatesError, UPDATE_DATES,
  UpdateDates, UpdateDatesSuccess, UpdateDatesError,
  UPDATE_NAME, updateNameSuccess, updateNameError,
  UpdateName, UpdateNameSuccess, UpdateNameError,
  UpdateUsersSuccess, UpdateUsersError, updateUsersSuccess,
  updateUsersError, UPDATE_USERS, UpdateUsers, REMOVE_TIME_ENTRY, RemoveTimeEntry, RemoveTimeEntrySuccess,
  RemoveTimeEntryError, removeTimeEntryError, removeTimeEntrySuccess, AddTimeEntryError, AddTimeEntrySuccess,
  addTimeEntrySuccess, addTimeEntryError, ADD_TIME_ENTRY, AddTimeEntry,
  UPDATE_DESCRIPTION, UpdateDescription, UpdateDescriptionSuccess, UpdateDescriptionError,
  updateDescriptionSuccess, updateDescriptionError, FETCH_WIDGETS, FetchWidgets, fetchWidgetsSuccess, fetchWidgetsError,
  FetchWidgetsError, FetchWidgetsSuccess,
} from '../actions/task.actions';
import { HttpInterceptor, ServerError } from '../../../providers/http.interceptor';
import { ParamsModel } from '../../activity/actions/activity.actions';
import {
  Task, TaskAttachmentPayload, TaskAttachmentParams,
  TaskTodoListParams, TaskTodoParams, Todo, TodoList, TimeEntryParams,
} from './../../../models/tasks/task.model';
import { TaskAttachment } from './../../../models/task-comment/task-comment.model';
import { User } from '../../user/actions/user.actions';

const pickTodoParams = omit(['name', 'dueDateBlock']);

const getTodoUrl = (params: TaskTodoParams): string => {
  const baseUrl = `projects/${params.projectId}/cards/${params.taskId}/todo_lists/${params.listId}/todos`;
  return params.todoId ? `${baseUrl}/${params.todoId}` : baseUrl;
};

const getTodoListUrl = (params: TaskTodoListParams): string => {
  const baseUrl = `/projects/${params.projectId}/cards/${params.taskId}/todo_lists`;
  return params.listId ? `${baseUrl}/${params.listId}` : baseUrl;
};

@Injectable()
export class TaskEffects {

  @Effect() public fetchDashboardCards$ = this.actions$
    .ofType(FETCH_DASHBOARD_CARDS)
    .map<FetchDashboardCards, DashboardCard[]>(toPayload)
    .switchMap(this.fetchDashboardCards.bind(this));

  @Effect() public fetchDashboardCardsByProject$ = this.actions$
    .ofType(FETCH_DASHBOARD_CARDS_BY_PROJECT)
    .map<FetchDashboardCardsByProject, DashboardCard[]>(toPayload)
    .switchMap(this.fetchDashboardCardsByProject.bind(this));

  @Effect() public fetchDashboardCardsByDueDate$ = this.actions$
    .ofType(FETCH_DASHBOARD_CARDS_BY_DUE_DATE)
    .map<FetchDashboardCardsByDueDate, DashboardCard[]>(toPayload)
    .switchMap(this.fetchDashboardCardsByDueDate.bind(this));

  @Effect() public fetchDashboardUsers$ = this.actions$
    .ofType(FETCH_DASHBOARD_USERS)
    .map<FetchDashboardUsers, User[]>(toPayload)
    .switchMap(this.fetchDashboardUsers.bind(this));

  @Effect() public loadMoreActivities$ = this.actions$
    .ofType(LOAD_MORE_DASHBOARD_CARDS)
    .map<LoadMoreDashboardCards, DashboardCard[]>(toPayload)
    .switchMap(this.loadMoreDashboardCards.bind(this));

  @Effect() public loadMoreTasksPerStage$ = this.actions$
    .ofType(LOAD_MORE_TASKS_PER_STAGE)
    .map<LoadMoreTasksPerStage, DashboardCard[]>(toPayload)
    .switchMap(this.loadMoreTasksPerStage.bind(this));

  @Effect() public loadMoreTasksPerDueDate$ = this.actions$
    .ofType(LOAD_MORE_TASKS_PER_DUE_DATE)
    .map<LoadMoreTasksPerDueDate, DashboardCard[]>(toPayload)
    .switchMap(this.loadMoreTasksPerDueDate.bind(this));

  @Effect() public fetchTask$ = this.actions$
    .ofType(FETCH_TASK)
    .map<FetchTask, TaskParams>(toPayload)
    .switchMap(this.fetchTask.bind(this));

  @Effect() public deleteTaskLayoutDueDate$ = this.actions$
    .ofType(DELETE_TASK_LAYOUT_DUE_DATE)
    .map<DeleteTask, TaskParams>(toPayload)
    .switchMap(this.deleteTaskLayoutDueDate.bind(this));

  @Effect() public deleteTaskLayoutProject$ = this.actions$
    .ofType(DELETE_TASK_LAYOUT_PROJECT)
    .map<DeleteTask, TaskParams>(toPayload)
    .switchMap(this.deleteTaskLayoutProject.bind(this));

  @Effect() public addAttachment$ = this.actions$
    .ofType(ADD_ATTACHMENT)
    .map<AddAttachment, TaskAttachmentPayload>(toPayload)
    .switchMap(this.addAttachment.bind(this));

  @Effect() public removeAttachment$ = this.actions$
    .ofType(REMOVE_ATTACHMENT)
    .map<RemoveAttachment, TaskAttachmentParams>(toPayload)
    .switchMap(this.removeAttachment.bind(this));

  @Effect() public updateStage$ = this.actions$
    .ofType(UPDATE_STAGE)
    .map<UpdateStage, UpdateStageParams>(toPayload)
    .switchMap(this.updateStage.bind(this));

  @Effect() public updateStatus$ = this.actions$
    .ofType(UPDATE_STATUS)
    .map<UpdateStatus, Task>(toPayload)
    .switchMap(this.updateStatus.bind(this));

  @Effect() public updateUsers$ = this.actions$
    .ofType(UPDATE_USERS)
    .map<UpdateUsers, Task>(toPayload)
    .switchMap(this.updateUsers.bind(this));

  @Effect() public addTodoList$ = this.actions$
    .ofType(ADD_TODO_LIST)
    .map<AddTodoList, TaskTodoListParams>(toPayload)
    .switchMap(this.addTodoList.bind(this));

  @Effect() public editTodoList$ = this.actions$
    .ofType(EDIT_TODO_LIST)
    .map<EditTodoList, TaskTodoListParams>(toPayload)
    .switchMap(this.editTodoList.bind(this));

  @Effect() public removeTodoList$ = this.actions$
    .ofType(REMOVE_TODO_LIST)
    .map<RemoveTodoList, TaskTodoListParams>(toPayload)
    .switchMap(this.removeTodoList.bind(this));

  @Effect() public addTodo$ = this.actions$
    .ofType(ADD_TODO)
    .map<AddTodo, any>(toPayload)
    .switchMap(this.addTodo.bind(this));

  @Effect() public editTodo$ = this.actions$
    .ofType(EDIT_TODO)
    .map<EditTodo, any>(toPayload)
    .switchMap(this.editTodo.bind(this));

  @Effect() public removeTodo$ = this.actions$
    .ofType(REMOVE_TODO)
    .map<RemoveTodo, TaskTodoParams>(toPayload)
    .switchMap(this.removeTodo.bind(this));

  @Effect() public removeTimeEntry$ = this.actions$
    .ofType(REMOVE_TIME_ENTRY)
    .map<RemoveTimeEntry, any>(toPayload)
    .switchMap(this.removeTimeEntry.bind(this));

  @Effect() public addTimeEntry$ = this.actions$
    .ofType(ADD_TIME_ENTRY)
    .map<AddTimeEntry, any>(toPayload)
    .switchMap(this.addTimeEntry.bind(this));

  @Effect() public updateDates$ = this.actions$
    .ofType(UPDATE_DATES)
    .map<UpdateDates, Task>(toPayload)
    .switchMap(this.updateDates.bind(this));

  @Effect() public updateName$ = this.actions$
    .ofType(UPDATE_NAME)
    .map<UpdateName, Task>(toPayload)
    .switchMap(this.updateName.bind(this));

  @Effect() public updateDescription$ = this.actions$
    .ofType(UPDATE_DESCRIPTION)
    .map<UpdateDescription, Task>(toPayload)
    .switchMap(this.updateDescription.bind(this));

  @Effect() public fetchWidgets$ = this.actions$
    .ofType(FETCH_WIDGETS)
    .map<FetchWidgets, any>(toPayload)
    .switchMap(this.fetchWidgets.bind(this));

  constructor(private actions$: Actions, private http: HttpInterceptor) {}

  private fetchDashboardCards(id?: number): Observable<FetchDashboardCardsSuccess|FetchDashboardCardsError> {
    const params = id ? { id } : {};
    return this.http.get('/dashboard', { params })
      .map<DashboardCard[], FetchDashboardCardsSuccess>(fetchDashboardCardsSuccess)
      .catch((payload: ServerError) => Observable.of(fetchDashboardCardsError(payload)));
  }

  private fetchDashboardCardsByProject(
    id?: number
  ): Observable<FetchDashboardCardsByProjectSuccess|FetchDashboardCardsByProjectError> {
    const params = id ? { group: 'project', id } : { group: 'project' };
    return this.http.get('/dashboard', { params })
      .map<DashboardCard[], FetchDashboardCardsSuccess>(fetchDashboardCardsByProjectSuccess)
      .catch((payload: ServerError) => Observable.of(fetchDashboardCardsByProjectError(payload)));
  }

  private fetchDashboardCardsByDueDate(
    id?: number
  ): Observable<FetchDashboardCardsSuccess | FetchDashboardCardsError> {
    const params = id ? { group: 'duedate', id } : { group: 'duedate' };
    return this.http.get('/dashboard', { params })
      .map<DashboardCardByDueDate[], FetchDashboardCardsByDueDateSuccess>(fetchDashboardCardsByDueDateSuccess)
      .catch((payload: ServerError) => Observable.of(fetchDashboardCardsByDueDateError(payload)));
  }

  private fetchDashboardUsers(): Observable<FetchDashboardUsersSuccess|FetchDashboardUsersError> {
    return this.http.get('/dashboard/users')
      .map<User[], FetchDashboardUsersSuccess>(fetchDashboardUsersSuccess)
      .catch((payload: ServerError) => Observable.of(fetchDashboardUsersError(payload)));
  }

  private loadMoreDashboardCards(
    payload: ParamsModel
  ): Observable<LoadMoreDashboardCardsSuccess|LoadMoreDashboardCardsError> {
    const params = payload.userId ? { page: payload.page, id: payload.userId } : { page: payload.page };
    return this.http.get('/dashboard', { params })
      .map<DashboardCard[], LoadMoreDashboardCardsSuccess>(loadMoreDashboardCardsSuccess)
      .catch((error: ServerError) => Observable.of(loadMoreDashboardCardsError(error)));
  }

  private loadMoreTasksPerStage(
    payload
  ): Observable<LoadMoreTasksPerStageSuccess|LoadMoreTasksPerStageError> {
    const params = payload.userId ?
      { page: payload.page, stage_id: payload.stageId, user: payload.userId }
      :
      { page: payload.page, stage_id: payload.stageId };
    return this.http.get(`/dashboard/1/entries`, { params })
      .map<Stage[], LoadMoreTasksPerStageSuccess>(loadMoreTasksPerStageSuccess)
      .catch((error: ServerError) => Observable.of(loadMoreTasksPerStageError(error)));
  }

  private loadMoreTasksPerDueDate(
    payload: LoadMoreTasksPerDueDateModel
  ): Observable<LoadMoreTasksPerDueDateSuccess|LoadMoreTasksPerDueDateError> {
    const params = payload.userId ? { page: payload.page, user: payload.userId } : { page: payload.page };
    return this.http.get(`/dashboard/${payload.group}/entries`, { params })
      .map<DashboardCard[], LoadMoreTasksPerDueDateSuccess>(loadMoreTasksPerDueDateSuccess)
      .catch((error: ServerError) => Observable.of(loadMoreTasksPerDueDateError(error)));
  }

  private fetchTask(taskParams: TaskParams): Observable<FetchTaskSuccess|FetchTaskError> {
    return this.http.get(`/projects/${taskParams.projectId}/cards/${taskParams.taskId}`)
      .map((task: Task): FetchTaskSuccess => fetchTaskSuccess({
        ...task,
        duedate_block: taskParams.dueDateBlock,
      }))
      .catch((error: ServerError) => Observable.of(fetchTaskError(error)));
  }

  private deleteTaskLayoutDueDate(taskParams: TaskParams): Observable<DeleteTaskSuccess|DeleteTaskError> {
    return this.deleteTaskRequest(taskParams)
      .map<any, DeleteTaskSuccess>(() => deleteTaskLayoutDueDateSuccess(taskParams))
      .catch((error: ServerError) => Observable.of(deleteTaskLayoutDueDateError(error)));
  }

  private deleteTaskLayoutProject(taskParams: TaskParams): Observable<DeleteTaskSuccess|DeleteTaskError> {
    return this.deleteTaskRequest(taskParams)
      .map<any, DeleteTaskSuccess>(() => deleteTaskLayoutProjectSuccess(taskParams))
      .catch((error: ServerError) => Observable.of(deleteTaskLayoutProjectError(error)));
  }

  private deleteTaskRequest(taskParams: TaskParams): Observable<any|ServerError> {
    return this.http.delete(`/projects/${taskParams.projectId}/cards/${taskParams.taskId}`);
  }

  private addAttachment(payload: TaskAttachmentPayload): Observable<AddAttachmentSuccess|AddAttachmentError> {
    let dispatchActions: (att: TaskAttachment) => Observable<AddAttachmentSuccess|UpdateTaskAttachmentsCount>;

    const { data, params } = payload;

    dispatchActions = (att) => {
      const attachment = merge(att, pick(['stageId', 'swimlaneId', 'dueDateBlock'], params));

      return Observable.from([
        addAttachmentSuccess(attachment),
        updateTaskAttachmentsCount(params),
      ]);
    };

    return this.http.post(`/projects/${params.projectId}/cards/${params.taskId}/attachments`, data)
      .concatMap(dispatchActions)
      .catch((error: ServerError) => Observable.of(addAttachmentError(error)));
  }

  private removeAttachment(params: TaskAttachmentParams): Observable<RemoveAttachmentSuccess|RemoveAttachmentError> {
    const url = `/projects/${params.projectId}/cards/${params.taskId}/attachments/${params.attachmentId}`;

    const removeAttachmentSuccess$ = Observable.from([
      removeAttachmentSuccess(params),
      updateTaskAttachmentsCount(params),
    ]);

    const request$ = this.http.delete(url)
      .map<string, Default>(defaultAction)
      .catch((error: ServerError) => Observable.of(removeAttachmentError(error)));

    return removeAttachmentSuccess$.concat(request$);
  }

  private updateStage(stageParams: UpdateStageParams): Observable<UpdateStageSuccess|UpdateStageError> {
    const { task, params } = stageParams;

    const deleteParams = {
      projectId: task.project_id,
      swimlaneId: task.swimlane_id,
      taskId: task.id,
      stageId: params.stageId,
    };

    const optmisticUpdate$ = Observable.from([
      updateStageSuccess(stageParams),
      deleteTaskFromProjectSuccess(deleteParams),
      addTaskSuccess(task),
    ]);

    const request$ =  this.http
      .put(`/projects/${task.project_id}/cards/${task.id}`, task)
      .map((taskResp: Task) =>  updateStageSuccess({
        ...stageParams,
        task,
      }))
      .catch((error: ServerError) => Observable.of(updateStageError(error)));

    return optmisticUpdate$.concat(request$);
  }

  private updateStatus(task: Task): Observable<UpdateStatusSuccess|UpdateStatusError> {
    const updateStatusSuccess$ = getStatusUpdateActions$(task);

    const request$ = this.http.put(`/projects/${task.project_id}/cards/${task.id}`, task)
      .concatMap((taskResp: Task) => {
        const payload: Task = { ...task };
        return getStatusUpdateActions$(payload);
      })
      .catch((error: ServerError) => Observable.of(updateStatusError(error)));

    return updateStatusSuccess$.concat(request$);
  }

  private updateUsers(task: Task): Observable<UpdateUsersSuccess|UpdateUsersError> {
    const request$ = this.http.put(`/projects/${task.project_id}/cards/${task.id}`, task)
      .concatMap(() => Observable.from([updateUsersSuccess(task), updateTaskUsers(task)]))
      .catch((error: ServerError) => Observable.of(updateUsersError(error)));

    const updateUsersSuccess$ = Observable.from([updateUsersSuccess(task), updateTaskUsers(task)]);
    return updateUsersSuccess$.concat(request$);
  }

  private addTodoList(params: TaskTodoListParams): Observable<AddTodoListSuccess|AddTodoListError> {
    const addTodoListSuccess$ = Observable.of(addTodoListSuccess(params));
    const request$ = this.http.post(getTodoListUrl(params), { name: params.name })
      .map<TodoList, AddTodoListSuccess>(addTodoListSuccess)
      .catch((error: ServerError) => Observable.of(addTodoListError(error)));

    return addTodoListSuccess$.concat(request$);
  }

  private editTodoList(params: TaskTodoListParams): Observable<EditTodoListSuccess|EditTodoListError> {
    const editTodoListSuccess$ = Observable.of(editTodoListSuccess(params));
    const request$ = this.http.put(getTodoListUrl(params), { name: params.name })
      .map<TodoList, EditTodoListSuccess>(editTodoListSuccess)
      .catch((error: ServerError) => Observable.of(editTodoListError(error)));

    return editTodoListSuccess$.concat(request$);
  }

  private removeTodoList(params: TaskTodoListParams): Observable<RemoveTodoListSuccess|RemoveTodoListError> {
    const type: TodoActionType = 'removeTodoList';
    const todoParams: TodoParams = merge(pickTodoParams(params), { type });
    const removeTodoListSuccess$ = Observable.from([
      removeTodoListSuccess(params),
      updateTaskTodosCount(todoParams),
    ]);
    const request$ = this.http.delete(getTodoListUrl(params))
      .map<any, RemoveTodoListSuccess>(() => removeTodoListSuccess(params))
      .catch((error: ServerError) => Observable.of(removeTodoListError(error)));

    return removeTodoListSuccess$.concat(request$);
  }

  private addTodo(params: TaskTodoParams): Observable<AddTodoSuccess|AddTodoError> {
    const type: TodoActionType = 'add';
    const todoParams: TodoParams = merge(pickTodoParams(params), { type });
    const addTodoSuccess$ = Observable.from([
      addTodoSuccess(params),
      updateTaskTodosCount(todoParams),
    ]);
    const request$ = this.http.post(getTodoUrl(params), { name: params.name })
      .map<Todo, AddTodoSuccess>((todo) =>
        addTodoSuccess(merge(todo, pick(['stageId', 'dueDateBlock'], params)))
      )
      .catch((error: ServerError) => Observable.of(addTodoError(error)));

    return addTodoSuccess$.concat(request$);
  }

  private editTodo(params: TaskTodoParams): Observable<EditTodoSuccess|EditTodoError> {
    const type: TodoActionType = 'edit';
    const todoParams: TodoParams = merge(pickTodoParams(params), { type });
    const editTodoSuccess$ = Observable.from([
      editTodoSuccess(params),
      updateTaskTodosCount(todoParams),
    ]);
    const request$ = this.http.put(getTodoUrl(params), params.todo)
      .map<Todo, Default>(defaultAction)
      .catch((error: ServerError) => Observable.of(editTodoError(error)));

    return editTodoSuccess$.concat(request$);
  }

  private removeTodo(params: TaskTodoParams): Observable<RemoveTodoSuccess|RemoveTodoError> {
    const type: TodoActionType = 'remove';
    const todoParams: TodoParams = merge(pickTodoParams(params), { type });
    const removeTodoSuccess$ = Observable.from([
      removeTodoSuccess(params),
      updateTaskTodosCount(todoParams),
    ]);
    const request$ = this.http.delete(getTodoUrl(params))
      .map<any, Default>(defaultAction)
      .catch((error: ServerError) => Observable.of(removeTodoError(error)));

    return removeTodoSuccess$.concat(request$);
  }

  private removeTimeEntry(params: TimeEntryParams): Observable<RemoveTimeEntrySuccess|RemoveTimeEntryError> {
    return this.http.delete(`/projects/${params.projectId}/cards/${params.taskId}/time_entry/${params.entryId}`)
      .concatMap(() =>
        Observable.from([removeTimeEntrySuccess(params), updateTaskTrackedTime({ params, operation: 'remove' })])
      )
      .catch((payload: ServerError) => Observable.of(removeTimeEntryError(payload)));
  }

  private addTimeEntry(params: TimeEntryParams): Observable<AddTimeEntrySuccess|AddTimeEntryError> {
    return this.http.post(
        `/projects/${params.projectId}/cards/${params.taskId}/time_entry`, { tracked: params.tracked }
      )
      .concatMap((response) =>
        Observable.from(
          [
            addTimeEntrySuccess({ params, response }),
            updateTaskTrackedTime({ params, operation: 'add' }),
          ]
        )
      )
      .catch((payload: ServerError) => Observable.of(addTimeEntryError(payload)));
  }
  private updateDates(task: Task): Observable<UpdateDatesSuccess & UpdateTaskDates | UpdateDatesError> {
    const updateDatesSuccess$ = Observable.from([ updateDatesSuccess(task), updateTaskDates(task) ]);

    const request$ = this.http.put(`/projects/${task.project_id}/cards/${task.id}`, task)
      .map<any, Default>(defaultAction)
      .catch((error: ServerError) => Observable.of(updateDatesError(error)));

    return updateDatesSuccess$.concat(request$);
  }

  private updateName(task: Task): Observable<UpdateNameSuccess|UpdateNameError> {
    const updateNameSuccess$ = Observable.from([ updateNameSuccess(task), updateTaskName(task) ]);

    const request$ = this.http.put(`/projects/${task.project_id}/cards/${task.id}`, task)
      .map<any, Default>(defaultAction)
      .catch((error: ServerError) => Observable.of(updateNameError(error)));

    return updateNameSuccess$.concat(request$);
  }

  private updateDescription(task: Task): Observable<UpdateDescriptionSuccess|UpdateDescriptionError> {
    const newTask: Task = {
      ...task,
      updated_at: new Date().toISOString(),
    };

    const updateDescriptionSuccess$ = Observable.from([
      updateDescriptionSuccess(newTask),
      updateTaskDescription(newTask),
    ]);

    const request$ = this.http.put(`/projects/${task.project_id}/cards/${task.id}`, task)
      .map<any, Default>(defaultAction)
      .catch((error: ServerError) => Observable.of(updateDescriptionError(error)));

    return updateDescriptionSuccess$.concat(request$);
  }

  private fetchWidgets(): Observable<FetchWidgetsSuccess|FetchWidgetsError> {
    return this.http.get('/widgets')
      .map<any, FetchWidgetsSuccess>(fetchWidgetsSuccess)
      .catch((payload: ServerError) => Observable.of(fetchWidgetsError(payload)));
  }
}

function getStatusUpdateActions$(task: Task): Observable<UpdateStatusSuccess & UpdateTaskStatus> {
  return Observable.from([ updateStatusSuccess(task), updateTaskStatus(task) ]);
}
