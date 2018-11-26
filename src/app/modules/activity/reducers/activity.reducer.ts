import { pathSatisfies, lt } from 'ramda';
import { Reducer, updateState } from '../../../actions-utils';
import {
  Activity, ActivityAction,
  DEFAULT, FETCH_ACTIVITIES, FETCH_ACTIVITIES_ERROR, FETCH_ACTIVITIES_SUCCESS,
  LOAD_MORE_ACTIVITIES, LOAD_MORE_ACTIVITIES_ERROR, LOAD_MORE_ACTIVITIES_SUCCESS,
  DELETE_TASK_FROM_ACTIVITY, DELETE_TASK_FROM_ACTIVITY_SUCCESS, DELETE_TASK_FROM_ACTIVITY_ERROR,
} from '../actions/activity.actions';
import { convertUserColorToHex } from '../../../helpers/convert-user-color-to-hex';

export interface ActivityStateItem {
  error: boolean;
  errorData: any;
  pending: boolean;
  success: boolean;
  value?: any;
}

export interface ActivityState {
  fetchActivities: ActivityStateItem;
  loadMoreActivities: ActivityStateItem;
  canLoadMoreActivities: ActivityStateItem;
  deleteTaskFromActivity: ActivityStateItem;
}

export const initialState: ActivityState = {
  fetchActivities: <ActivityStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: false,
    value: null,
  },
  loadMoreActivities: <ActivityStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: false,
    value: null,
  },
  canLoadMoreActivities: <ActivityStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: false,
    value: null,
  },
  deleteTaskFromActivity: <ActivityStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: false,
    value: null,
  },
};

type ActivityReducer = Reducer<ActivityState, ActivityAction>;

const canLoadMoreSuccessReducer: ActivityReducer = (state, action) =>
  updateState(state, 'canLoadMoreActivities', <ActivityStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: pathSatisfies(lt(0), ['payload', 'length'], action),
  });

const fetchActivitiesReducer: ActivityReducer = (state, _) =>
  updateState(state, 'fetchActivities', <ActivityStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: null,
  });

const fetchActivitiesSuccessReducer: ActivityReducer = (state, action) => {
  const canLoadMoreState = canLoadMoreSuccessReducer(state, action);

  return updateState(canLoadMoreState, 'fetchActivities', <ActivityStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload,
  });
};

const fetchActivitiesErrorReducer: ActivityReducer = (state, action) =>
  updateState(state, 'fetchActivities', <ActivityStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: state.fetchActivities.value,
  });

const loadMoreActivitiesReducer: ActivityReducer = (state, action) =>
  updateState(state, 'loadMoreActivities', <ActivityStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload, // Last fetched page
  });

const loadMoreActivitiesSuccessReducer: ActivityReducer = (state, action) => {
  const canLoadMoreState = canLoadMoreSuccessReducer(state, action);

  const newActivities = updateState(canLoadMoreState, 'fetchActivities', <ActivityStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: state.fetchActivities.value.concat(action.payload),
  });

  return updateState(newActivities, 'loadMoreActivities', <ActivityStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: state.loadMoreActivities.value, // Last fetched page
  });
};

const loadMoreActivitiesErrorReducer: ActivityReducer = (state, action) =>
  updateState(state, 'loadMoreActivities', <ActivityStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: state.loadMoreActivities.value, // Last fetched page
  });

const deleteTaskFromActivityReducer: ActivityReducer = (state, action) =>
  updateState(state, 'deleteTaskFromActivity', <ActivityStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload,
  });

const deleteTaskFromActivitySuccessReducer: ActivityReducer = (state, action) =>
  updateState(state, 'deleteTaskFromActivity', <ActivityStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload,
  });

const deleteTaskFromActivityErrorReducer: ActivityReducer = (state, action) =>
  updateState(state, 'deleteTaskFromActivity', <ActivityStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: state.deleteTaskFromActivity.value,
  });

const defaultReducer: ActivityReducer = (state, _) => state;

const selectReducer = (actionType: string): ActivityReducer => {
  const actionToReducerMap = {
    [FETCH_ACTIVITIES]: fetchActivitiesReducer,
    [FETCH_ACTIVITIES_SUCCESS]: fetchActivitiesSuccessReducer,
    [FETCH_ACTIVITIES_ERROR]: fetchActivitiesErrorReducer,
    [LOAD_MORE_ACTIVITIES]: loadMoreActivitiesReducer,
    [LOAD_MORE_ACTIVITIES_SUCCESS]: loadMoreActivitiesSuccessReducer,
    [LOAD_MORE_ACTIVITIES_ERROR]: loadMoreActivitiesErrorReducer,
    [DELETE_TASK_FROM_ACTIVITY]: deleteTaskFromActivityReducer,
    [DELETE_TASK_FROM_ACTIVITY_SUCCESS]: deleteTaskFromActivitySuccessReducer,
    [DELETE_TASK_FROM_ACTIVITY_ERROR]: deleteTaskFromActivityErrorReducer,
    [DEFAULT]: defaultReducer,
  };
  return actionToReducerMap[actionType] || actionToReducerMap[DEFAULT];
};

export function activityReducer(state = initialState, action) {
  const reducer: ActivityReducer = selectReducer(action.type);
  return reducer(state, action);
}
