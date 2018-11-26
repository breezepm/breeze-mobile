import { Action } from '@ngrx/store';

import { type, actionsDispatcher } from '../../../actions-utils';
import { Board } from './../../../models/projects/board.model';
import { Stage } from './../../../models/projects/stage.model';
import { ProjectDetails } from './../../../models/projects/project-details.model';
import { TasksPayload, Task, Todo, TimeEntryParams, TaskAttachmentParams } from './../../../models/tasks/task.model';
import { CommentActionType } from './../../../models/task-comment/task-comment.model';
import { ServerError } from './../../../providers/http.interceptor';
import { TaskParams } from './../../tasks/actions/task.actions';

export const DEFAULT = type('[Project] No action match');

export const ADD_STAGE = type('[Project] Add Stage');
export const ADD_STAGE_SUCCESS = type('[Project] Add Stage Success');
export const ADD_STAGE_ERROR = type('[Project] Add Stage error');

export const REMOVE_STAGE = type('[Project] Remove Stage');
export const REMOVE_STAGE_SUCCESS = type('[Project] Remove Stage Success');
export const REMOVE_STAGE_ERROR = type('[Project] Remove Stage error');

export const UPDATE_STAGE_NAME = type('[Project] Update Stage Name');
export const UPDATE_STAGE_NAME_SUCCESS = type('[Project] Update Stage Name Success');
export const UPDATE_STAGE_NAME_ERROR = type('[Project] Update Stage Name error');

export const FETCH_PROJECT = type('[Project] Fetch Project');
export const FETCH_PROJECT_SUCCESS = type('[Project] Fetch Project Success');
export const FETCH_PROJECT_ERROR = type('[Project] Fetch Project Error');

export const LOAD_MORE_TASKS = type('[Project] Load More Tasks');
export const LOAD_MORE_TASKS_SUCCESS = type('[Project] Load More Tasks Success');
export const LOAD_MORE_TASKS_ERROR = type('[Project] Load More Tasks Error');

export const FETCH_PROJECTS = type('[Project] Fetch Projects');
export const FETCH_PROJECTS_SUCCESS = type('[Project] Fetch Projects Success');
export const FETCH_PROJECTS_ERROR = type('[Project] Fetch Projects Error');
export const REMOVE_FROM_FETCHED_PROJECTS = type('[Project] Remove From Fetched Projects');

export const ARCHIVE_PROJECT = type('[Project] Archive Project');
export const ARCHIVE_PROJECT_SUCCESS = type('[Project] Archive Project Success');
export const ARCHIVE_PROJECT_ERROR = type('[Project] Archive Project Error');

export const DELETE_PROJECT = type('[Project] Delete Project');
export const DELETE_PROJECT_SUCCESS = type('[Project] Delete Project Success');
export const DELETE_PROJECT_ERROR = type('[Project] Delete Project Error');

export const CREATE_PROJECT = type('[Project] Create Project');
export const CREATE_PROJECT_SUCCESS = type('[Project] Create Project Success');
export const CREATE_PROJECT_ERROR = type('[Project] Create Project Error');

export const UPDATE_PROJECT = type('[Project] Update Project');
export const UPDATE_PROJECT_SUCCESS = type('[Project] Update Project Success');
export const UPDATE_PROJECT_ERROR = type('[Project] Update Project Error');

export const UPDATE_PROJECTS_INVITEE = type('[Project] Update Projects Invitee');
export const UPDATE_PROJECTS_INVITEE_SUCCESS = type('[Project] Update Projects Invitee Success');
export const UPDATE_PROJECTS_INVITEE_ERROR = type('[Project] Update Projects Invitee Error');

export const REMOVE_PROJECTS_INVITEE = type('[Project] Remove Projects Invitee');
export const REMOVE_PROJECTS_INVITEE_SUCCESS = type('[Project] Remove Projects Invitee Success');
export const REMOVE_PROJECTS_INVITEE_ERROR = type('[Project] Remove Projects Invitee Error');

export const TASK_DROPPED = type('[Project] Task Dropped on Project Swimlane');
export const TASK_DROPPED_SUCCESS = type('[Project] Task Dropped on Project Swimlane Success');
export const TASK_DROPPED_ERROR = type('[Project] Task Dropped on Project Swimlane Error');

export const ADD_TASK = type('[Project] Add Task to Swimlane');
export const ADD_TASK_SUCCESS = type('[Project] Add Task to Swimlane Success');
export const ADD_TASK_ERROR = type('[Project] Add Task to Swimlane Error');

export const DELETE_TASK_FROM_PROJECT = type('[Project] Delete Task From Project');
export const DELETE_TASK_FROM_PROJECT_SUCCESS = type('[Project] Delete Task From Project Success');
export const DELETE_TASK_FROM_PROJECT_ERROR = type('[Project] Delete Task From Project Error');

export const RESET_SUBSTATES = type('[Project] Reset Substates: addStage, removeStage, updateStageName, loadMoreTasks');

export const UPDATE_TASK_ATTACHMENTS_COUNT = type('[Project] Update Task Attachments Count');
export const UPDATE_TASK_COMMENTS_COUNT = type('[Project] Update Task Comments Count');
export const UPDATE_TASK_TODOS_COUNT = type('[Project] Update Task Todos Count');
export const UPDATE_TASK_STATUS = type('[Project] Update Task Status');
export const UPDATE_TASK_DATES = type('[Project] Update Task Dates');
export const UPDATE_TASK_USERS = type('[Project] Update Task Users');
export const UPDATE_TASK_NAME = type('[Project] Update Task Name');
export const UPDATE_TASK_TRACKED_TIME = type('[Project] Update Task Tracked Time');
export const UPDATE_TASK_DESCRIPTION = type('[Project] Update Task Description');

export interface DropLocator {
  taskId: number;
  from: { stageId: number, swimlaneId: number };
  to: { stageId: number, swimlaneId: number };
}

export interface DroppedTaskLocator extends DropLocator {
  projectId: number;
  prevTaskId: number|null;
}

export interface ProjectLocator {
  workspaceId: number;
  projectId: number;
}

export interface StageLocator {
  projectId: number;
  stageId: number;
  stageName?: string;
}

export interface TasksLocator extends StageLocator {
  swimlaneId: number;
  page: number;
}

export interface ProjectData {
  id?: number;
  name?: string;
  invitees?: any[];
  workspace_id?: number | null | string;
  users?: any[];
}

export interface NewTask {
  name: string;
  projectId: number;
  stageId: number;
  swimlaneId: number;
  addLast?: boolean;
  description?: string;
}

export type TodoActionType = 'add'|'remove'|'edit'|'removeTodoList';

export interface TodoParams {
  readonly type: TodoActionType;
  readonly swimlaneId: number;
  readonly stageId: number;
  readonly taskId: number;
  readonly listId?: number;
  readonly todoId?: number;
  readonly todo?: Todo;
  readonly wasTodoDone?: boolean;
  readonly todos?: Todo[];
}

export interface TaskCommentParams {
  readonly stageId: number;
  readonly swimlaneId: number;
  readonly taskId: number;
  readonly type: CommentActionType;
  readonly dueDateBlock?: number;
  readonly projectId?: number;
  readonly mentions?: number[];
}

/* Actions interfaces */

export interface AddStage extends Action {
  payload: number;
}

export interface AddStageSuccess extends Action {
  payload: Stage;
}

export interface AddStageError extends Action {
  payload: ServerError;
}

export interface RemoveStage extends Action {
  payload: StageLocator;
}

export interface RemoveStageSuccess extends Action {
  payload: StageLocator;
}

export interface RemoveStageError extends Action {
  payload: ServerError;
}

export interface UpdateStageName extends Action {
  payload: StageLocator;
}

export interface UpdateStageNameSuccess extends Action {
  payload: StageLocator;
}

export interface UpdateStageNameError extends Action {
  payload: ServerError;
}

export interface FetchProject extends Action {
  payload: number;
}

export interface FetchProjectSuccess extends Action {
  payload: ProjectDetails;
}

export interface FetchProjectError extends Action {
  payload: ServerError;
}

export interface LoadMoreTasks extends Action {
  payload: TasksLocator;
}

export interface LoadMoreTasksSuccess extends Action {
  payload: TasksPayload;
}

export interface LoadMoreTasksError extends Action {
  payload: ServerError;
}

export interface FetchProjects extends Action {
  payload?: any;
}

export interface FetchProjectsSuccess extends Action {
  payload: Board[];
}

export interface FetchProjectsError extends Action {
  payload: ServerError;
}

export interface RemoveFromFetchedProjects extends Action {
  payload: ProjectLocator;
}

export interface ArchiveProject extends Action {
  payload: number;
}

export interface ArchiveProjectSuccess extends Action {
  payload: ProjectLocator;
}

export interface ArchiveProjectError extends Action {
  payload: ServerError;
}

export interface DeleteProject extends Action {
  payload: number;
}

export interface DeleteProjectSuccess extends Action {
  payload: ProjectLocator;
}

export interface DeleteProjectError extends Action {
  payload: ServerError;
}

export interface CreateProject extends Action {
  payload: ProjectData;
}

export interface CreateProjectSuccess extends Action {
  payload: any;
}

export interface CreateProjectError extends Action {
  payload: ServerError;
}

interface UpdateProject extends Action {
  payload?: any;
}

interface UpdateProjectSuccess extends Action {
  payload: any;
}

interface UpdateProjectError extends Action {
  payload: ServerError;
}

interface UpdateProjectsInvitee extends Action {
  payload?: any;
}

interface UpdateProjectsInviteeSuccess extends Action {
  payload?: any;
}

interface UpdateProjectsInviteeError extends Action {
  payload: ServerError;
}

interface RemoveProjectsInvitee extends Action {
  payload?: any;
}

interface RemoveProjectsInviteeSuccess extends Action {
  payload?: any;
}

interface RemoveProjectsInviteeError extends Action {
  payload: ServerError;
}

export interface TaskDropped extends Action {
  payload: DroppedTaskLocator;
}

export interface TaskDroppedSuccess extends Action {
  payload: DroppedTaskLocator;
}

export interface TaskDroppedError extends Action {
  payload: ServerError;
}

export interface AddTask extends Action {
  payload: NewTask;
}

export interface AddTaskSuccess extends Action {
  payload: NewTask|Task;
}

export interface AddTaskError extends Action {
  payload: ServerError;
}

export interface ResetSubstates extends Action {
  payload?: any;
}

export interface DeleteTaskFromProject extends Action {
  payload: TaskParams;
}

export interface DeleteTaskFromProjectSuccess extends Action {
  payload: TaskParams;
}

export interface DeleteTaskFromProjectError extends Action {
  payload: ServerError;
}

export interface UpdateTaskTodosCount extends Action {
  payload: TodoParams;
}

export interface UpdateTaskAttachmentsCount extends Action {
  payload: TaskAttachmentParams;
}

export interface UpdateTaskCommentsCount extends Action {
  payload: TaskCommentParams;
}

export interface UpdateTaskStatus extends Action {
  payload: Task;
}

export interface UpdateTaskDates extends Action {
  payload: Task;
}

export interface UpdateTaskUsers extends Action {
  payload: Task;
}

export interface UpdateTaskTrackedTime extends Action {
  payload: TimeEntryParams;
}

export interface UpdateTaskName extends Action {
  payload: Task;
}

export interface UpdateTaskDescription extends Action {
  payload: Task;
}

export type ProjectAction =
  AddStage
  | AddStageSuccess
  | AddStageError
  | RemoveStage
  | RemoveStageSuccess
  | RemoveStageError
  | UpdateStageName
  | UpdateStageNameSuccess
  | UpdateStageNameError
  | FetchProject
  | FetchProjectSuccess
  | FetchProjectError
  | LoadMoreTasks
  | LoadMoreTasksSuccess
  | LoadMoreTasksError
  | FetchProjects
  | FetchProjectsSuccess
  | FetchProjectsError
  | RemoveFromFetchedProjects
  | ArchiveProject
  | ArchiveProjectSuccess
  | ArchiveProjectError
  | DeleteProject
  | DeleteProjectSuccess
  | DeleteProjectError
  | CreateProject
  | CreateProjectSuccess
  | CreateProjectError
  | UpdateProject
  | UpdateProjectSuccess
  | UpdateProjectError
  | UpdateProjectsInvitee
  | UpdateProjectsInviteeSuccess
  | UpdateProjectsInviteeError
  | RemoveProjectsInvitee
  | RemoveProjectsInviteeSuccess
  | RemoveProjectsInviteeError
  | TaskDropped
  | TaskDroppedSuccess
  | TaskDroppedError
  | AddTask
  | AddTaskSuccess
  | AddTaskError
  | DeleteTaskFromProject
  | DeleteTaskFromProjectSuccess
  | DeleteTaskFromProjectError
  | ResetSubstates
  | UpdateTaskTodosCount
  | UpdateTaskCommentsCount
  | UpdateTaskStatus
  | UpdateTaskDates
  | UpdateTaskUsers
  | UpdateTaskTrackedTime
  | UpdateTaskName
  | UpdateTaskDescription
;

export const addStage = actionsDispatcher<number, AddStage>(ADD_STAGE);
export const addStageSuccess = actionsDispatcher<Stage, AddStageSuccess>(ADD_STAGE_SUCCESS);
export const addStageError = actionsDispatcher<ServerError, AddStageError>(ADD_STAGE_ERROR);

export const removeStage = actionsDispatcher<StageLocator, RemoveStage>(REMOVE_STAGE);
export const removeStageSuccess = actionsDispatcher<StageLocator, RemoveStageSuccess>(REMOVE_STAGE_SUCCESS);
export const removeStageError = actionsDispatcher<ServerError, RemoveStageError>(REMOVE_STAGE_ERROR);

export const updateStageName =
  actionsDispatcher<StageLocator, UpdateStageName>(UPDATE_STAGE_NAME);
export const updateStageNameSuccess =
  actionsDispatcher<StageLocator, UpdateStageNameSuccess>(UPDATE_STAGE_NAME_SUCCESS);
export const updateStageNameError =
  actionsDispatcher<ServerError, UpdateStageNameError>(UPDATE_STAGE_NAME_ERROR);

export const fetchProject = actionsDispatcher<number, FetchProject>(FETCH_PROJECT);
export const fetchProjectSuccess = actionsDispatcher<ProjectDetails, FetchProjectSuccess>(FETCH_PROJECT_SUCCESS);
export const fetchProjectError = actionsDispatcher<ServerError, FetchProjectError>(FETCH_PROJECT_ERROR);

export const loadMoreTasks = actionsDispatcher<TasksLocator, LoadMoreTasks>(LOAD_MORE_TASKS);
export const loadMoreTasksSuccess = actionsDispatcher<TasksPayload, LoadMoreTasksSuccess>(LOAD_MORE_TASKS_SUCCESS);
export const loadMoreTasksError = actionsDispatcher<ServerError, LoadMoreTasksError>(LOAD_MORE_TASKS_ERROR);

export const fetchProjects = actionsDispatcher<any, FetchProjects>(FETCH_PROJECTS);
export const fetchProjectsSuccess = actionsDispatcher<Board[], FetchProjectsSuccess>(FETCH_PROJECTS_SUCCESS);
export const fetchProjectsError = actionsDispatcher<ServerError, FetchProjectsError>(FETCH_PROJECTS_ERROR);

export const removeFromFetchedProjects =
  actionsDispatcher<ProjectLocator, RemoveFromFetchedProjects>(REMOVE_FROM_FETCHED_PROJECTS);

export const archiveProject = actionsDispatcher<ProjectLocator, ArchiveProject>(ARCHIVE_PROJECT);
export const archiveProjectSuccess = actionsDispatcher<ProjectLocator, ArchiveProjectSuccess>(ARCHIVE_PROJECT_SUCCESS);
export const archiveProjectError = actionsDispatcher<ServerError, ArchiveProjectError>(ARCHIVE_PROJECT_ERROR);

export const deleteProject = actionsDispatcher<ProjectLocator, DeleteProject>(DELETE_PROJECT);
export const deleteProjectSuccess = actionsDispatcher<ProjectLocator, DeleteProjectSuccess>(DELETE_PROJECT_SUCCESS);
export const deleteProjectError = actionsDispatcher<ServerError, DeleteProjectError>(DELETE_PROJECT_ERROR);

export const createProject = actionsDispatcher<ProjectData, CreateProject>(CREATE_PROJECT);
export const createProjectSuccess = actionsDispatcher<any, CreateProjectSuccess>(CREATE_PROJECT_SUCCESS);
export const createProjectError = actionsDispatcher<ServerError, CreateProjectError>(CREATE_PROJECT_ERROR);

export const taskDropped = actionsDispatcher<DroppedTaskLocator, TaskDropped>(TASK_DROPPED);
export const taskDroppedSuccess = actionsDispatcher<DroppedTaskLocator, TaskDroppedSuccess>(TASK_DROPPED_SUCCESS);
export const taskDroppedError = actionsDispatcher<ServerError, TaskDroppedError>(TASK_DROPPED_ERROR);

export const resetSubstates = actionsDispatcher<any, ResetSubstates>(RESET_SUBSTATES);

export const updateProject = actionsDispatcher<ProjectData, UpdateProject>(UPDATE_PROJECT);
export const updateProjectSuccess = actionsDispatcher<any, UpdateProjectSuccess>(UPDATE_PROJECT_SUCCESS);
export const updateProjectError = actionsDispatcher<ServerError, UpdateProjectError>(UPDATE_PROJECT_ERROR);

export const updateProjectsInvitee = actionsDispatcher<ProjectData, ProjectAction>(UPDATE_PROJECTS_INVITEE);
export const updateProjectsInviteeSuccess = actionsDispatcher<any, ProjectAction>(UPDATE_PROJECTS_INVITEE_SUCCESS);
export const updateProjectsInviteeError = actionsDispatcher<ServerError, ProjectAction>(UPDATE_PROJECTS_INVITEE_ERROR);

export const removeProjectsInvitee = actionsDispatcher<any, ProjectAction>(REMOVE_PROJECTS_INVITEE);
export const removeProjectsInviteeSuccess = actionsDispatcher<any, ProjectAction>(REMOVE_PROJECTS_INVITEE_SUCCESS);
export const removeProjectsInviteeError = actionsDispatcher<ServerError, ProjectAction>(REMOVE_PROJECTS_INVITEE_ERROR);

export const addTask = actionsDispatcher<NewTask, AddTask>(ADD_TASK);
export const addTaskSuccess = actionsDispatcher<NewTask|Task, AddTaskSuccess>(ADD_TASK_SUCCESS);
export const addTaskError = actionsDispatcher<ServerError, AddTaskError>(ADD_TASK_ERROR);

export const deleteTaskFromProject =
  actionsDispatcher<TaskParams, DeleteTaskFromProject>(DELETE_TASK_FROM_PROJECT);
export const deleteTaskFromProjectSuccess =
  actionsDispatcher<TaskParams, DeleteTaskFromProjectSuccess>(DELETE_TASK_FROM_PROJECT_SUCCESS);
export const deleteTaskFromProjectError =
  actionsDispatcher<ServerError, DeleteTaskFromProjectError>(DELETE_TASK_FROM_PROJECT_ERROR);

export const updateTaskAttachmentsCount =
  actionsDispatcher<TaskAttachmentParams, UpdateTaskAttachmentsCount>(UPDATE_TASK_ATTACHMENTS_COUNT);
export const updateTaskCommentsCount =
  actionsDispatcher<TaskCommentParams, UpdateTaskCommentsCount>(UPDATE_TASK_COMMENTS_COUNT);
export const updateTaskTodosCount = actionsDispatcher<TodoParams, UpdateTaskTodosCount>(UPDATE_TASK_TODOS_COUNT);
export const updateTaskStatus = actionsDispatcher<Task, UpdateTaskStatus>(UPDATE_TASK_STATUS);
export const updateTaskDates = actionsDispatcher<Task, UpdateTaskDates>(UPDATE_TASK_DATES);
export const updateTaskName = actionsDispatcher<Task, UpdateTaskName>(UPDATE_TASK_NAME);
export const updateTaskUsers = actionsDispatcher<Task, UpdateTaskUsers>(UPDATE_TASK_USERS);
export const updateTaskTrackedTime = actionsDispatcher<any, UpdateTaskTrackedTime>(UPDATE_TASK_TRACKED_TIME);
export const updateTaskDescription = actionsDispatcher<Task, UpdateTaskDescription>(UPDATE_TASK_DESCRIPTION);
