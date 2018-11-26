import { evolve, reject, propEq } from 'ramda';
import { TaskReducer, TaskStateItem } from '../task.reducer';
import { updateState } from '../../../../actions-utils';
import { mapWhenPropsEq } from './../../../../helpers/map-when-props-eq';
import { getTasksList } from './../../utils/utils-reducers';
import {
  TaskParams,
  DELETE_TASK_LAYOUT_DUE_DATE,
  DELETE_TASK_LAYOUT_DUE_DATE_SUCCESS,
  DELETE_TASK_LAYOUT_DUE_DATE_ERROR,
} from './../../actions/task.actions';

const deleteTaskLayoutDueDateReducer: TaskReducer = (state, action) =>
  updateState(state, 'deleteTaskLayoutDueDate', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload,
  });

const deleteTaskLayoutDueDateSuccessReducer: TaskReducer = (state, action) => {
  const dashboards = getTasksList(state);

  const taskParams: TaskParams = action.payload;

  const updateDashboards = mapWhenPropsEq({ 'duedate_block': taskParams.dueDateBlock }, evolve({
    cards: reject(propEq('card_id', taskParams.taskId)),
  }));

  const newFetchedDashboards = updateState(state, 'fetchDashboardCards', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: updateDashboards(dashboards),
  });

  return updateState(newFetchedDashboards, 'deleteTaskLayoutDueDate', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: taskParams,
  });
};

const deleteTaskLayoutDueDateErrorReducer: TaskReducer = (state, action) =>
  updateState(state, 'deleteTaskLayoutDueDate', <TaskStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

export const deleteTaskLayoutDueDateReducerSlice = {
  [DELETE_TASK_LAYOUT_DUE_DATE]: deleteTaskLayoutDueDateReducer,
  [DELETE_TASK_LAYOUT_DUE_DATE_SUCCESS]: deleteTaskLayoutDueDateSuccessReducer,
  [DELETE_TASK_LAYOUT_DUE_DATE_ERROR]: deleteTaskLayoutDueDateErrorReducer,
};
