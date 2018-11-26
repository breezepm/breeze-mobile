import { TaskReducer, TaskStateItem } from '../task.reducer';
import { updateState } from '../../../../actions-utils';
import { FETCH_TASK, FETCH_TASK_SUCCESS, FETCH_TASK_ERROR } from './../../actions/task.actions';

const fetchTaskReducer: TaskReducer = (state, _) =>
  updateState(state, 'fetchTask', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: null,
  });

const fetchTaskSuccessReducer: TaskReducer = (state, action) =>
  updateState(state, 'fetchTask', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload,
  });

const fetchTaskErrorReducer: TaskReducer = (state, action) =>
  updateState(state, 'fetchTask', <TaskStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

export const fetchTaskReducerSlice = {
  [FETCH_TASK]: fetchTaskReducer,
  [FETCH_TASK_SUCCESS]: fetchTaskSuccessReducer,
  [FETCH_TASK_ERROR]: fetchTaskErrorReducer,
};
