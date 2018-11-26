import { TaskReducer, TaskStateItem } from '../task.reducer';
import { updateState } from '../../../../actions-utils';
import { FETCH_WIDGETS, FETCH_WIDGETS_SUCCESS, FETCH_WIDGETS_ERROR } from './../../actions/task.actions';

const fetchWidgetsReducer: TaskReducer = (state, _) =>
  updateState(state, 'fetchWidgets', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: null,
  });

const fetchWidgetsSuccessReducer: TaskReducer = (state, action) =>
  updateState(state, 'fetchWidgets', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload,
  });

const fetchWidgetsErrorReducer: TaskReducer = (state, action) =>
  updateState(state, 'fetchWidgets', <TaskStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

export const fetchWidgetsReducerSlice = {
  [FETCH_WIDGETS]: fetchWidgetsReducer,
  [FETCH_WIDGETS_SUCCESS]: fetchWidgetsSuccessReducer,
  [FETCH_WIDGETS_ERROR]: fetchWidgetsErrorReducer,
};
