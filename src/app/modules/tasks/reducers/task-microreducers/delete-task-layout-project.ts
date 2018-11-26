import { evolve, reject, propEq } from 'ramda';
import { TaskReducer, TaskStateItem } from '../task.reducer';
import { updateState } from '../../../../actions-utils';
import { mapWhenPropsEq } from './../../../../helpers/map-when-props-eq';
import { getTasksList } from './../../utils/utils-reducers';
import {
  TaskParams,
  DELETE_TASK_LAYOUT_PROJECT,
  DELETE_TASK_LAYOUT_PROJECT_SUCCESS,
  DELETE_TASK_LAYOUT_PROJECT_ERROR,
} from './../../actions/task.actions';

const deleteTaskLayoutProjectReducer: TaskReducer = (state, action) =>
  updateState(state, 'deleteTaskLayoutProject', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload,
  });

const deleteTaskLayoutProjectSuccessReducer: TaskReducer = (state, action) => {
  const dashboards = getTasksList(state);
  const taskParams: TaskParams = action.payload;

  const filterTask = mapWhenPropsEq({ 'project_id': taskParams.projectId }, evolve({
    'stages': mapWhenPropsEq({ 'stage_id': taskParams.stageId }, evolve({
      'cards': reject(propEq('card_id', taskParams.taskId)),
    })),
  }));

  const newFetchedDashboards = updateState(state, 'fetchDashboardCards', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: filterTask(dashboards),
  });

  return updateState(newFetchedDashboards, 'deleteTaskLayoutProject', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: taskParams,
  });
};

const deleteTaskLayoutProjectErrorReducer: TaskReducer = (state, action) =>
  updateState(state, 'deleteTaskLayoutProject', <TaskStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

export const deleteTaskLayoutProjectReducerSlice = {
  [DELETE_TASK_LAYOUT_PROJECT]: deleteTaskLayoutProjectReducer,
  [DELETE_TASK_LAYOUT_PROJECT_SUCCESS]: deleteTaskLayoutProjectSuccessReducer,
  [DELETE_TASK_LAYOUT_PROJECT_ERROR]: deleteTaskLayoutProjectErrorReducer,
};
