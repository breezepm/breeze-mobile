import { TaskParams } from './../../tasks/actions/task.actions';
import { actionsDispatcher, type } from '../../../actions-utils';
import { Action } from '@ngrx/store';
import { ServerError } from '../../../providers/http.interceptor';

export const DEFAULT = type('[Activity] No action match');

export const FETCH_ACTIVITIES = type('[Activity] Fetch Activities');
export const FETCH_ACTIVITIES_SUCCESS = type('[Activity] Fetch Activities Success');
export const FETCH_ACTIVITIES_ERROR = type('[Activity] Fetch Activities Error');

export const LOAD_MORE_ACTIVITIES = type('[Activity] Load More Activities');
export const LOAD_MORE_ACTIVITIES_SUCCESS = type('[Activity] Load More Activities Success');
export const LOAD_MORE_ACTIVITIES_ERROR = type('[Activity] Load More Activities Error');

export const DELETE_TASK_FROM_ACTIVITY = type('[Activity] Delete Task From Activity');
export const DELETE_TASK_FROM_ACTIVITY_SUCCESS = type('[Activity] Delete Task From Activity Success');
export const DELETE_TASK_FROM_ACTIVITY_ERROR = type('[Activity] Delete Task From Activity Error');

export interface ParamsModel {
  page: number;
  userId?: number;
}

export interface Activity {
  audits: any[];
  date_group: string;
}

export interface FetchActivities extends Action {
  payload?: any;
}

export interface FetchActivitiesSuccess extends Action {
  payload: Activity[];
}

export interface FetchActivitiesError extends Action {
  payload: ServerError;
}

export interface LoadMoreActivities extends Action {
  payload: ParamsModel;
}

export interface LoadMoreActivitiesSuccess extends Action {
  payload: Activity[];
}

export interface LoadMoreActivitiesError extends Action {
  payload: ServerError;
}

export interface DeleteTaskFromActivity extends Action {
  payload: TaskParams;
}

export interface DeleteTaskFromActivitySuccess extends Action {
  payload: TaskParams;
}

export interface DeleteTaskFromActivityError extends Action {
  payload: ServerError;
}

export type ActivityAction =
  FetchActivities
  | FetchActivitiesSuccess
  | FetchActivitiesError
  | LoadMoreActivities
  | LoadMoreActivitiesSuccess
  | LoadMoreActivitiesError
  | DeleteTaskFromActivity
  | DeleteTaskFromActivitySuccess
  | DeleteTaskFromActivityError;

export const fetchActivities =
  actionsDispatcher<any, FetchActivities>(FETCH_ACTIVITIES);
export const fetchActivitiesSuccess =
  actionsDispatcher<Activity[], FetchActivitiesSuccess>(FETCH_ACTIVITIES_SUCCESS);
export const fetchActivitiesError =
  actionsDispatcher<ServerError, FetchActivitiesError>(FETCH_ACTIVITIES_ERROR);

export const loadMoreActivities =
  actionsDispatcher<ParamsModel, LoadMoreActivities>(LOAD_MORE_ACTIVITIES);
export const loadMoreActivitiesSuccess =
  actionsDispatcher<Activity[], LoadMoreActivitiesSuccess>(LOAD_MORE_ACTIVITIES_SUCCESS);
export const loadMoreActivitiesError =
  actionsDispatcher<ServerError, LoadMoreActivitiesError>(LOAD_MORE_ACTIVITIES_ERROR);

export const deleteTaskFromActivity =
  actionsDispatcher<TaskParams, DeleteTaskFromActivity>(DELETE_TASK_FROM_ACTIVITY);
export const deleteTaskFromActivitySuccess =
  actionsDispatcher<TaskParams, DeleteTaskFromActivitySuccess>(DELETE_TASK_FROM_ACTIVITY_SUCCESS);
export const deleteTaskFromActivityError =
  actionsDispatcher<ServerError, DeleteTaskFromActivityError>(DELETE_TASK_FROM_ACTIVITY_ERROR);
