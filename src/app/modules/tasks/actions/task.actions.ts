import { TaskCommentParams } from './../../projects/actions/project.actions';
import { type, actionsDispatcher } from '../../../actions-utils';
import { Action } from '@ngrx/store';
import { ServerError } from '../../../providers/http.interceptor';
import {
  Task, TaskAttachmentPayload, TaskAttachmentParams, TaskTodoListParams, TodoList, Todo, TaskTodoParams, Widget,
} from '../../../models/tasks/task.model';
import { TaskAttachment } from './../../../models/task-comment/task-comment.model';
import { User } from '../../user/actions/user.actions';

export const DEFAULT = type('[Task] No action match');

export const FETCH_DASHBOARD_CARDS = type('[Task] Fetch Dashboard Cards');
export const FETCH_DASHBOARD_CARDS_SUCCESS = type('[Task] Fetch Dashboard Cards Success');
export const FETCH_DASHBOARD_CARDS_ERROR = type('[Task] Fetch Dashboard Cards Error');

export const FETCH_DASHBOARD_CARDS_BY_PROJECT = type('[Task] Fetch Dashboard Cards By Project');
export const FETCH_DASHBOARD_CARDS_BY_PROJECT_SUCCESS = type('[Task] Fetch Dashboard Cards By Project Success');
export const FETCH_DASHBOARD_CARDS_BY_PROJECT_ERROR = type('[Task] Fetch Dashboard Cards By Project Error');

export const FETCH_DASHBOARD_CARDS_BY_DUE_DATE = type('[Task] Fetch Dashboard Cards By Due Date');
export const FETCH_DASHBOARD_CARDS_BY_DUE_DATE_SUCCESS = type('[Task] Fetch Dashboard Cards By Due Date Success');
export const FETCH_DASHBOARD_CARDS_BY_DUE_DATE_ERROR = type('[Task] Fetch Dashboard Cards By Due Date Error');

export const FETCH_DASHBOARD_USERS = type('[Task] Fetch Dashboard Users');
export const FETCH_DASHBOARD_USERS_SUCCESS = type('[Task] Fetch Dashboard Users Success');
export const FETCH_DASHBOARD_USERS_ERROR = type('[Task] Fetch Dashboard Users Error');

export const RESET_LOAD_MORE_DASHBOARD_CARDS = type('[Task] Reset Load More Dashboard Cards');

export const LOAD_MORE_DASHBOARD_CARDS = type('[Task] Load More Dashboard Cards');
export const LOAD_MORE_DASHBOARD_CARDS_SUCCESS = type('[Task] Load More Dashboard Cards Success');
export const LOAD_MORE_DASHBOARD_CARDS_ERROR = type('[Task] Load More Dashboard Cards Error');

export const LOAD_MORE_TASKS_PER_STAGE = type('[Task] Load More Tasks Per Stage');
export const LOAD_MORE_TASKS_PER_STAGE_SUCCESS = type('[Task] Load More Tasks Per Stage Success');
export const LOAD_MORE_TASKS_PER_STAGE_ERROR = type('[Task] Load More Tasks Per Stage Error');

export const LOAD_MORE_TASKS_PER_DUE_DATE = type('[Task] Load More Tasks Per Due Date');
export const LOAD_MORE_TASKS_PER_DUE_DATE_SUCCESS = type('[Task] Load More Tasks Per Due Date Success');
export const LOAD_MORE_TASKS_PER_DUE_DATE_ERROR = type('[Task] Load More Tasks Per Due Date Error');

export const FETCH_TASK = type('[Task] Fetch Task');
export const FETCH_TASK_SUCCESS = type('[Task] Fetch Task Success');
export const FETCH_TASK_ERROR = type('[Task] Fetch Task Error');

export const DELETE_TASK_LAYOUT_DUE_DATE = type('[Task] Delete Task Layout Due Date');
export const DELETE_TASK_LAYOUT_DUE_DATE_SUCCESS = type('[Task] Delete Task Layout Due Date Success');
export const DELETE_TASK_LAYOUT_DUE_DATE_ERROR = type('[Task] Delete Task Layout Due Date Error');

export const DELETE_TASK_LAYOUT_PROJECT = type('[Task] Delete Task Layout Project');
export const DELETE_TASK_LAYOUT_PROJECT_SUCCESS = type('[Task] Delete Task Layout Project Success');
export const DELETE_TASK_LAYOUT_PROJECT_ERROR = type('[Task] Delete Task Layout Project Error');

export const SAVE_POPOVER_STATE = type('[Task] Save Popover State');
export const RESET_POPOVER_STATE = type('[Task] Reset Popover State');

export const ADD_ATTACHMENT = type('[Task] Add Attachment');
export const ADD_ATTACHMENT_SUCCESS = type('[Task] Add Attachment Success');
export const ADD_ATTACHMENT_ERROR = type('[Task] Add Attachment Error');

export const REMOVE_ATTACHMENT = type('[Task] Remove Attachment');
export const REMOVE_ATTACHMENT_SUCCESS = type('[Task] Remove Attachment Success');
export const REMOVE_ATTACHMENT_ERROR = type('[Task] Remove Attachment Error');

export const UPDATE_STAGE = type('[Task] Update Stage');
export const UPDATE_STAGE_SUCCESS = type('[Task] Update Stage Success');
export const UPDATE_STAGE_ERROR = type('[Task] Update Stage Error');

export const UPDATE_STATUS = type('[Task] Update Status');
export const UPDATE_STATUS_SUCCESS = type('[Task] Update Status Success');
export const UPDATE_STATUS_ERROR = type('[Task] Update Status Error');

export const UPDATE_USERS = type('[Task] Update Users');
export const UPDATE_USERS_SUCCESS = type('[Task] Update Users Success');
export const UPDATE_USERS_ERROR = type('[Task] Update Users Error');

export const ADD_TODO_LIST = type('[Task] Add Todo List');
export const ADD_TODO_LIST_SUCCESS = type('[Task] Add Todo List Success');
export const ADD_TODO_LIST_ERROR = type('[Task] Add Todo List Error');

export const EDIT_TODO_LIST = type('[Task] Edit Todo List');
export const EDIT_TODO_LIST_SUCCESS = type('[Task] Edit Todo List Success');
export const EDIT_TODO_LIST_ERROR = type('[Task] Edit Todo List Error');

export const REMOVE_TODO_LIST = type('[Task] Remove Todo List');
export const REMOVE_TODO_LIST_SUCCESS = type('[Task] Remove Todo List Success');
export const REMOVE_TODO_LIST_ERROR = type('[Task] Remove Todo List Error');

export const ADD_TODO = type('[Task] Add Todo To List');
export const ADD_TODO_SUCCESS = type('[Task] Add Todo To List Success');
export const ADD_TODO_ERROR = type('[Task] Add Todo To List Error');

export const EDIT_TODO = type('[Task] Edit Todo');
export const EDIT_TODO_SUCCESS = type('[Task] Edit Todo Success');
export const EDIT_TODO_ERROR = type('[Task] Edit Todo Error');

export const REMOVE_TODO = type('[Task] Remove Todo From List');
export const REMOVE_TODO_SUCCESS = type('[Task] Remove Todo From List Success');
export const REMOVE_TODO_ERROR = type('[Task] Remove Todo From List Error');

export const UPDATE_DATES = type('[Task] Update Dates');
export const UPDATE_DATES_SUCCESS = type('[Task] Update Dates Success');
export const UPDATE_DATES_ERROR = type('[Task] Update Dates Error');

export const UPDATE_NAME = type('[Task] Update Task Name');
export const UPDATE_NAME_SUCCESS = type('[Task] Update Task Name Success');
export const UPDATE_NAME_ERROR = type('[Task] Update Task Name Error');

export const REMOVE_TIME_ENTRY = type('[Task] Remove Time Entry');
export const REMOVE_TIME_ENTRY_SUCCESS = type('[Task] Remove Time Entry Success');
export const REMOVE_TIME_ENTRY_ERROR = type('[Task] Remove Time Entry Error');

export const ADD_TIME_ENTRY = type('[Task] Add Time Entry');
export const ADD_TIME_ENTRY_SUCCESS = type('[Task] Add Time Entry Success');
export const ADD_TIME_ENTRY_ERROR = type('[Task] Add Time Entry Error');

export const UPDATE_DESCRIPTION = type('[Task] Update Description');
export const UPDATE_DESCRIPTION_SUCCESS = type('[Task] Update Description Success');
export const UPDATE_DESCRIPTION_ERROR = type('[Task] Update Description Error');

export const FETCH_WIDGETS = type('[Task] Fetch Widgets');
export const FETCH_WIDGETS_SUCCESS = type('[Task] Fetch Widgets Success');
export const FETCH_WIDGETS_ERROR = type('[Task] Fetch Widgets Error');

export const ADD_NEW_TASK_TO_WIDGETS = type('[Task] Add New Task To Widgets');

export const UPDATE_COMMENTS_COUNT_ON_LIST = type('[Task] Update Comments Count on Tasks List');

export type DashboardLayout = 'duedate' | 'project';

export type OriginPage = 'TasksByProjectsPage' | 'TasksByDatePage' | 'ProjectPage' | 'ActivityPage' | 'SearchPage'
                        | 'AddNewTaskPage';

export interface Stage {
  cards: Task[];
  next_page: boolean;
  stage_id?: number;
  stage_name?: string;
}

export interface PopoverState {
  userId?: number;
  page?: string;
}

export interface DashboardCardByDueDate {
  cards: Task[];
  dashboard_layout: DashboardLayout;
  duedate_block: number;
  duedate_block_name: string;
  next_page: boolean;
  page: number;
}

export interface DashboardCard {
  cards?: Task[];
  dashboard_layout?: DashboardLayout;
  duedate_block?: number;
  duedate_block_name?: string;
  next_page?: boolean;
  project_id?: number;
  project_name?: string;
  stages?: Stage[];
}

export interface LoadMoreTasks {
  dashboardGroup: DashboardCard;
  page?: number;
  stageId: number;
}

export interface TaskParams {
  readonly projectId: number;
  readonly taskId: number;
  readonly origin?: OriginPage;
  readonly stageId?: number;
  readonly swimlaneId?: number;
  readonly dueDateBlock?: number;
  readonly dashboardLayout?: DashboardLayout;
}

export interface UpdateStageParams {
  task: Task;
  params: TaskParams;
}

interface Project {
  stages: any;
  swimlanes: any;
  cards: any;
}

/* Actions Interfaces */

export interface Default extends Action {
  payload?: any;
}

export interface LoadMoreTasksPerDueDateModel {
  group: number;
  page: number;
  userId: number;
}

export type DashboardCardsPayload = string | number;

export interface FetchDashboardCards extends Action {
  payload?: any;
}

export interface FetchDashboardCardsSuccess extends Action {
  payload: DashboardCard[];
}

export interface FetchDashboardCardsError extends Action {
  payload: ServerError;
}

export interface FetchDashboardCardsByProject extends Action {
  payload?: any;
}

export interface FetchDashboardCardsByProjectSuccess extends Action {
  payload: DashboardCard[];
}

export interface FetchDashboardCardsByProjectError extends Action {
  payload: ServerError;
}

export interface FetchDashboardUsers extends Action {
  payload?: any;
}

export interface FetchDashboardUsersSuccess extends Action {
  payload: User[];
}

export interface FetchDashboardUsersError extends Action {
  payload: ServerError;
}

export interface FetchDashboardCardsByDueDate extends Action {
  payload?: any;
}

export interface FetchDashboardCardsByDueDateSuccess extends Action {
  payload: DashboardCard[];
}

export interface FetchDashboardCardsByDueDateError extends Action {
  payload: ServerError;
}

export interface LoadMoreDashboardCards extends Action {
  payload: DashboardCardsPayload;
}

export interface LoadMoreDashboardCardsSuccess extends Action {
  payload: DashboardCard[];
}

export interface LoadMoreDashboardCardsError extends Action {
  payload: ServerError;
}

export interface LoadMoreTasksPerStage extends Action {
  payload: LoadMoreTasks;
}

export interface LoadMoreTasksPerStageSuccess extends Action {
  payload: DashboardCard[];
}

export interface LoadMoreTasksPerStageError extends Action {
  payload: ServerError;
}

export interface LoadMoreTasksPerDueDate extends Action {
  payload: LoadMoreTasksPerDueDateModel;
}

export interface LoadMoreTasksPerDueDateSuccess extends Action {
  payload: DashboardCardByDueDate[];
}

export interface LoadMoreTasksPerDueDateError extends Action {
  payload: ServerError;
}

export interface FetchTask extends Action {
  payload: TaskParams;
}

export interface FetchTaskSuccess extends Action {
  payload: Task;
}

export interface FetchTaskError extends Action {
  payload: ServerError;
}

export interface DeleteTaskLayoutDueDate extends Action {
  payload: TaskParams;
}

export interface DeleteTaskLayoutDueDateSuccess extends Action {
  payload: TaskParams;
}

export interface DeleteTaskLayoutDueDateError extends Action {
  payload: ServerError;
}

export interface DeleteTaskLayoutProject extends Action {
  payload: TaskParams;
}

export interface DeleteTaskLayoutProjectSuccess extends Action {
  payload: TaskParams;
}

export interface DeleteTaskLayoutProjectError extends Action {
  payload: ServerError;
}

export interface SavePopoverState extends Action {
  payload: SavePopoverState;
}

export interface ResetPopoverState extends Action {
  payload?: any;
}

export interface AddAttachment extends Action {
  payload: TaskAttachmentPayload;
}

export interface AddAttachmentSuccess extends Action {
  payload: TaskAttachmentParams;
}

export interface AddAttachmentError extends Action {
  payload: ServerError;
}

export interface RemoveAttachment extends Action {
  payload: TaskAttachmentPayload;
}

export interface RemoveAttachmentSuccess extends Action {
  payload: TaskAttachmentParams;
}

export interface RemoveAttachmentError extends Action {
  payload: ServerError;
}

export type DeleteTask =
  DeleteTaskLayoutDueDate
  | DeleteTaskLayoutProject;

export type DeleteTaskSuccess =
  DeleteTaskLayoutDueDateSuccess
  | DeleteTaskLayoutProjectSuccess;

export type DeleteTaskError =
  | DeleteTaskLayoutDueDateError
  | DeleteTaskLayoutProjectError;

export interface UpdateStage extends Action {
  payload: UpdateStageParams;
}

export interface UpdateStageSuccess extends Action {
  payload: UpdateStageParams;
}

export interface UpdateStageError extends Action {
  payload: ServerError;
}

export interface UpdateStatus extends Action {
  payload: Task;
}

export interface UpdateStatusSuccess extends Action {
  payload: Task;
}

export interface UpdateStatusError extends Action {
  payload: ServerError;
}

export interface UpdateUsers extends Action {
  payload: Task;
}

export interface UpdateUsersSuccess extends Action {
  payload: Task;
}

export interface UpdateUsersError extends Action {
  payload: ServerError;
}

export interface AddTodoList extends Action {
  payload: TaskTodoListParams;
}

export interface AddTodoListSuccess extends Action {
  payload: TaskTodoListParams | TodoList;
}

export interface AddTodoListError extends Action {
  payload: ServerError;
}

export interface EditTodoList extends Action {
  payload: TaskTodoListParams;
}

export interface EditTodoListSuccess extends Action {
  payload: TaskTodoListParams|TodoList;
}

export interface EditTodoListError extends Action {
  payload: ServerError;
}

export interface RemoveTodoList extends Action {
  payload: TaskTodoListParams;
}

export interface RemoveTodoListSuccess extends Action {
  payload: TaskTodoListParams;
}

export interface RemoveTodoListError extends Action {
  payload: ServerError;
}

export interface AddTodo extends Action {
  payload: TaskTodoParams;
}

export interface AddTodoSuccess extends Action {
  payload: TaskTodoParams|Todo;
}

export interface AddTodoError extends Action {
  payload: ServerError;
}

export interface EditTodo extends Action {
  payload: TaskTodoParams;
}

export interface EditTodoSuccess extends Action {
  payload: TaskTodoParams;
}

export interface EditTodoError extends Action {
  payload: ServerError;
}

export interface RemoveTodo extends Action {
  payload: TaskTodoParams;
}

export interface RemoveTodoSuccess extends Action {
  payload: TaskTodoParams;
}

export interface RemoveTodoError extends Action {
  payload: ServerError;
}

export interface UpdateDates extends Action {
  payload: Task;
}

export interface UpdateDatesSuccess extends Action {
  payload: Task;
}

export interface UpdateDatesError extends Action {
  payload: ServerError;
}

export interface UpdateName extends Action {
  payload: Task;
}

export interface UpdateNameSuccess extends Action {
  payload: Task;
}

export interface UpdateNameError extends Action {
  payload: ServerError;
}

export interface RemoveTimeEntry extends Action {
  payload: any;
}

export interface RemoveTimeEntrySuccess extends Action {
  payload: any;
}

export interface RemoveTimeEntryError extends Action {
  payload: ServerError;
}

export interface AddTimeEntry extends Action {
  payload: any;
}

export interface AddTimeEntrySuccess extends Action {
  payload: any;
}

export interface AddTimeEntryError extends Action {
  payload: ServerError;
}

export interface UpdateDescription extends Action {
  payload: Task;
}

export interface UpdateDescriptionSuccess extends Action {
  payload: Task;
}

export interface UpdateDescriptionError extends Action {
  payload: ServerError;
}

export interface UpdateCommentsCountOnList extends Action {
  payload: TaskCommentParams;
}

export interface FetchWidgets extends Action {
  payload?: any;
}

export interface FetchWidgetsSuccess extends Action {
  payload: Widget;
}

export interface FetchWidgetsError extends Action {
  payload: ServerError;
}

export interface AddNewTaskToWidgets extends Action {
  payload: Task;
}

export type TaskAction =
  FetchDashboardCards
  | FetchDashboardCardsSuccess
  | FetchDashboardCardsError
  | FetchDashboardCardsByProject
  | FetchDashboardCardsByProjectSuccess
  | FetchDashboardCardsByProjectError
  | FetchDashboardCardsByDueDate
  | FetchDashboardCardsByDueDateSuccess
  | FetchDashboardCardsByDueDateError
  | FetchDashboardUsers
  | FetchDashboardUsersSuccess
  | FetchDashboardUsersError
  | LoadMoreDashboardCards
  | LoadMoreDashboardCardsSuccess
  | LoadMoreDashboardCardsError
  | LoadMoreTasksPerStage
  | LoadMoreTasksPerStageSuccess
  | LoadMoreTasksPerStageError
  | LoadMoreTasksPerDueDate
  | LoadMoreTasksPerDueDateSuccess
  | LoadMoreTasksPerDueDateError
  | FetchTask
  | FetchTaskSuccess
  | FetchTaskError
  | DeleteTask
  | DeleteTaskSuccess
  | DeleteTaskError
  | SavePopoverState
  | ResetPopoverState
  | AddAttachment
  | AddAttachmentSuccess
  | AddAttachmentError
  | RemoveAttachment
  | RemoveAttachmentSuccess
  | RemoveAttachmentError
  | UpdateStage
  | UpdateStageSuccess
  | UpdateStageError
  | UpdateStatus
  | UpdateStatusSuccess
  | UpdateStatusError
  | UpdateUsers
  | UpdateUsersSuccess
  | UpdateUsersError
  | AddTodoList
  | AddTodoListSuccess
  | AddTodoListError
  | EditTodoList
  | EditTodoListSuccess
  | EditTodoListError
  | RemoveTodoList
  | RemoveTodoListSuccess
  | RemoveTodoListError
  | AddTodo
  | AddTodoSuccess
  | AddTodoError
  | EditTodo
  | EditTodoSuccess
  | EditTodoError
  | RemoveTodo
  | RemoveTodoSuccess
  | RemoveTodoError
  | UpdateDates
  | UpdateDatesSuccess
  | UpdateDatesError
  | UpdateName
  | UpdateNameSuccess
  | UpdateNameError
  | RemoveTodoError
  | RemoveTimeEntry
  | RemoveTimeEntrySuccess
  | RemoveTimeEntryError
  | UpdateCommentsCountOnList
  | FetchWidgets
  | FetchWidgetsSuccess
  | FetchWidgetsError
;

export const defaultAction = actionsDispatcher<null, Default>(DEFAULT);

export const fetchDashboardCards =
  actionsDispatcher<DashboardCardsPayload, FetchDashboardCards>(FETCH_DASHBOARD_CARDS);
export const fetchDashboardCardsSuccess =
  actionsDispatcher<DashboardCard[], FetchDashboardCardsSuccess>(FETCH_DASHBOARD_CARDS_SUCCESS);
export const fetchDashboardCardsError =
  actionsDispatcher<ServerError, FetchDashboardCardsError>(FETCH_DASHBOARD_CARDS_ERROR);

export const fetchDashboardCardsByProject =
  actionsDispatcher<DashboardCardsPayload, FetchDashboardCardsByProject>(FETCH_DASHBOARD_CARDS_BY_PROJECT);
export const fetchDashboardCardsByProjectSuccess =
  actionsDispatcher<DashboardCard[], FetchDashboardCardsByProjectSuccess>(FETCH_DASHBOARD_CARDS_BY_PROJECT_SUCCESS);
export const fetchDashboardCardsByProjectError =
  actionsDispatcher<ServerError, FetchDashboardCardsByProjectError>(FETCH_DASHBOARD_CARDS_BY_PROJECT_ERROR);

export const fetchDashboardCardsByDueDate =
  actionsDispatcher<DashboardCardsPayload, FetchDashboardCardsByDueDate>(
    FETCH_DASHBOARD_CARDS_BY_DUE_DATE
  );
export const fetchDashboardCardsByDueDateSuccess =
  actionsDispatcher<DashboardCardByDueDate[], FetchDashboardCardsByDueDateSuccess>(
    FETCH_DASHBOARD_CARDS_BY_DUE_DATE_SUCCESS
  );
export const fetchDashboardCardsByDueDateError =
  actionsDispatcher<ServerError, FetchDashboardCardsByDueDateError>(
    FETCH_DASHBOARD_CARDS_BY_DUE_DATE_ERROR
  );

export const fetchDashboardUsers = actionsDispatcher<any, FetchDashboardUsers>(FETCH_DASHBOARD_USERS);
export const fetchDashboardUsersSuccess =
  actionsDispatcher<User[], FetchDashboardUsersSuccess>(FETCH_DASHBOARD_USERS_SUCCESS);
export const fetchDashboardUsersError =
  actionsDispatcher<ServerError, FetchDashboardUsersError>(FETCH_DASHBOARD_USERS_ERROR);

export const resetLoadMoreDashboardCards =
  actionsDispatcher<any, any>(RESET_LOAD_MORE_DASHBOARD_CARDS);

export const loadMoreDashboardCards =
  actionsDispatcher<any, LoadMoreDashboardCards>(LOAD_MORE_DASHBOARD_CARDS);
export const loadMoreDashboardCardsSuccess =
  actionsDispatcher<DashboardCard[], LoadMoreDashboardCardsSuccess>(LOAD_MORE_DASHBOARD_CARDS_SUCCESS);
export const loadMoreDashboardCardsError =
  actionsDispatcher<ServerError, LoadMoreDashboardCardsError>(LOAD_MORE_DASHBOARD_CARDS_ERROR);

export const loadMoreTasksPerStage =
  actionsDispatcher<any, LoadMoreTasksPerStage>(LOAD_MORE_TASKS_PER_STAGE);
export const loadMoreTasksPerStageSuccess =
  actionsDispatcher<Stage[], LoadMoreTasksPerStageSuccess>(LOAD_MORE_TASKS_PER_STAGE_SUCCESS);
export const loadMoreTasksPerStageError =
  actionsDispatcher<ServerError, LoadMoreTasksPerStageError>(LOAD_MORE_TASKS_PER_STAGE_ERROR);

export const loadMoreTasksPerDueDate =
  actionsDispatcher<LoadMoreTasksPerDueDateModel, LoadMoreTasksPerDueDate>(LOAD_MORE_TASKS_PER_DUE_DATE);
export const loadMoreTasksPerDueDateSuccess =
  actionsDispatcher<DashboardCard[], LoadMoreTasksPerDueDateSuccess>(LOAD_MORE_TASKS_PER_DUE_DATE_SUCCESS);
export const loadMoreTasksPerDueDateError =
  actionsDispatcher<ServerError, LoadMoreTasksPerDueDateError>(LOAD_MORE_TASKS_PER_DUE_DATE_ERROR);

export const fetchTask = actionsDispatcher<TaskParams, FetchTask>(FETCH_TASK);
export const fetchTaskSuccess = actionsDispatcher<Task, FetchTaskSuccess>(FETCH_TASK_SUCCESS);
export const fetchTaskError = actionsDispatcher<ServerError, FetchTaskError>(FETCH_TASK_ERROR);

export const deleteTaskLayoutDueDate =
  actionsDispatcher<TaskParams, DeleteTaskLayoutDueDate>(DELETE_TASK_LAYOUT_DUE_DATE);
export const deleteTaskLayoutDueDateSuccess =
  actionsDispatcher<TaskParams, DeleteTaskLayoutDueDateSuccess>(DELETE_TASK_LAYOUT_DUE_DATE_SUCCESS);
export const deleteTaskLayoutDueDateError =
  actionsDispatcher<ServerError, DeleteTaskLayoutDueDateError>(DELETE_TASK_LAYOUT_DUE_DATE_ERROR);

export const deleteTaskLayoutProject =
  actionsDispatcher<TaskParams, DeleteTaskLayoutProject>(DELETE_TASK_LAYOUT_PROJECT);
export const deleteTaskLayoutProjectSuccess =
  actionsDispatcher<TaskParams, DeleteTaskLayoutProjectSuccess>(DELETE_TASK_LAYOUT_PROJECT_SUCCESS);
export const deleteTaskLayoutProjectError =
  actionsDispatcher<ServerError, DeleteTaskLayoutProjectError>(DELETE_TASK_LAYOUT_PROJECT_ERROR);

export const savePopoverState = actionsDispatcher<PopoverState, SavePopoverState>(SAVE_POPOVER_STATE);
export const resetPopoverState = actionsDispatcher<any, ResetPopoverState>(RESET_POPOVER_STATE);

export const addAttachment = actionsDispatcher<TaskAttachmentPayload, AddAttachment>(ADD_ATTACHMENT);
export const addAttachmentSuccess = actionsDispatcher<TaskAttachment, AddAttachmentSuccess>(ADD_ATTACHMENT_SUCCESS);
export const addAttachmentError = actionsDispatcher<ServerError, AddAttachmentError>(ADD_ATTACHMENT_ERROR);

export const removeAttachment = actionsDispatcher<TaskAttachmentParams, AddAttachment>(REMOVE_ATTACHMENT);
export const removeAttachmentSuccess =
  actionsDispatcher<TaskAttachmentParams, AddAttachmentSuccess>(REMOVE_ATTACHMENT_SUCCESS);
export const removeAttachmentError = actionsDispatcher<ServerError, AddAttachmentError>(REMOVE_ATTACHMENT_ERROR);

export const updateStage = actionsDispatcher<UpdateStageParams, UpdateStage>(UPDATE_STAGE);
export const updateStageSuccess = actionsDispatcher<UpdateStageParams, UpdateStageSuccess>(UPDATE_STAGE_SUCCESS);
export const updateStageError = actionsDispatcher<ServerError, UpdateStageError>(UPDATE_STAGE_ERROR);

export const updateStatus = actionsDispatcher<Task, UpdateStatus>(UPDATE_STATUS);
export const updateStatusSuccess = actionsDispatcher<Task, UpdateStatusSuccess>(UPDATE_STATUS_SUCCESS);
export const updateStatusError = actionsDispatcher<ServerError, UpdateStatusError>(UPDATE_STATUS_ERROR);

export const updateUsers = actionsDispatcher<Task, UpdateUsers>(UPDATE_USERS);
export const updateUsersSuccess = actionsDispatcher<Task, UpdateUsersSuccess>(UPDATE_USERS_SUCCESS);
export const updateUsersError = actionsDispatcher<ServerError, UpdateUsersError>(UPDATE_USERS_ERROR);

export const addTodoList =
  actionsDispatcher<TaskTodoListParams, AddTodoList>(ADD_TODO_LIST);
export const addTodoListSuccess =
  actionsDispatcher<TaskTodoListParams|TodoList, AddTodoListSuccess>(ADD_TODO_LIST_SUCCESS);
export const addTodoListError =
  actionsDispatcher<ServerError, AddTodoListError>(ADD_TODO_LIST_ERROR);

export const editTodoList =
  actionsDispatcher<TaskTodoListParams, EditTodoList>(EDIT_TODO_LIST);
export const editTodoListSuccess =
  actionsDispatcher<TaskTodoListParams|TodoList, EditTodoListSuccess>(EDIT_TODO_LIST_SUCCESS);
export const editTodoListError =
  actionsDispatcher<ServerError, EditTodoListError>(EDIT_TODO_LIST_ERROR);

export const removeTodoList =
  actionsDispatcher<TaskTodoListParams, RemoveTodoList>(REMOVE_TODO_LIST);
export const removeTodoListSuccess =
  actionsDispatcher<TaskTodoListParams, RemoveTodoListSuccess>(REMOVE_TODO_LIST_SUCCESS);
export const removeTodoListError =
  actionsDispatcher<ServerError, RemoveTodoListError>(REMOVE_TODO_LIST_ERROR);

export const addTodo = actionsDispatcher<TaskTodoParams, AddTodo>(ADD_TODO);
export const addTodoSuccess = actionsDispatcher<TaskTodoParams|Todo, AddTodoSuccess>(ADD_TODO_SUCCESS);
export const addTodoError = actionsDispatcher<ServerError, AddTodoError>(ADD_TODO_ERROR);

export const editTodo = actionsDispatcher<TaskTodoParams, EditTodo>(EDIT_TODO);
export const editTodoSuccess = actionsDispatcher<TaskTodoParams, EditTodoSuccess>(EDIT_TODO_SUCCESS);
export const editTodoError = actionsDispatcher<ServerError, EditTodoError>(EDIT_TODO_ERROR);

export const removeTodo = actionsDispatcher<TaskTodoParams, RemoveTodo>(REMOVE_TODO);
export const removeTodoSuccess = actionsDispatcher<TaskTodoParams, RemoveTodoSuccess>(REMOVE_TODO_SUCCESS);
export const removeTodoError = actionsDispatcher<ServerError, RemoveTodoError>(REMOVE_TODO_ERROR);

export const updateDates = actionsDispatcher<Task, UpdateDates>(UPDATE_DATES);
export const updateDatesSuccess = actionsDispatcher<Task, UpdateDatesSuccess>(UPDATE_DATES_SUCCESS);
export const updateDatesError = actionsDispatcher<ServerError, UpdateDatesError>(UPDATE_DATES_ERROR);

export const updateName = actionsDispatcher<Task, UpdateName>(UPDATE_NAME);
export const updateNameSuccess = actionsDispatcher<Task, UpdateNameSuccess>(UPDATE_NAME_SUCCESS);
export const updateNameError = actionsDispatcher<ServerError, UpdateNameError>(UPDATE_NAME_ERROR);

export const removeTimeEntry = actionsDispatcher<any, RemoveTimeEntry>(REMOVE_TIME_ENTRY);
export const removeTimeEntrySuccess = actionsDispatcher<any, RemoveTimeEntrySuccess>(REMOVE_TIME_ENTRY_SUCCESS);
export const removeTimeEntryError = actionsDispatcher<ServerError, RemoveTimeEntryError>(REMOVE_TIME_ENTRY_ERROR);

export const addTimeEntry = actionsDispatcher<any, AddTimeEntry>(ADD_TIME_ENTRY);
export const addTimeEntrySuccess = actionsDispatcher<any, AddTimeEntrySuccess>(ADD_TIME_ENTRY_SUCCESS);
export const addTimeEntryError = actionsDispatcher<ServerError, AddTimeEntryError>(ADD_TIME_ENTRY_ERROR);

export const updateDescription = actionsDispatcher<Task, UpdateDescription>(UPDATE_DESCRIPTION);
export const updateDescriptionSuccess = actionsDispatcher<Task, UpdateDescriptionSuccess>(UPDATE_DESCRIPTION_SUCCESS);
export const updateDescriptionError = actionsDispatcher<ServerError, UpdateDescriptionError>(UPDATE_DESCRIPTION_ERROR);

export const updateCommentsCountOnList =
  actionsDispatcher<TaskCommentParams, UpdateCommentsCountOnList>(UPDATE_COMMENTS_COUNT_ON_LIST);

export const fetchWidgets = actionsDispatcher<any, FetchWidgets>(FETCH_WIDGETS);
export const fetchWidgetsSuccess =
  actionsDispatcher<Widget, FetchWidgetsSuccess>(FETCH_WIDGETS_SUCCESS);
export const fetchWidgetsError =
  actionsDispatcher<ServerError, FetchWidgetsError>(FETCH_WIDGETS_ERROR);

export const addNewTaskToWidgets = actionsDispatcher<Task, AddNewTaskToWidgets>(ADD_NEW_TASK_TO_WIDGETS);
