import { TaskReducer, TaskStateItem } from '../task.reducer';
import { updateState } from '../../../../actions-utils';
import {
  FETCH_DASHBOARD_CARDS_BY_DUE_DATE,
  FETCH_DASHBOARD_CARDS_BY_DUE_DATE_SUCCESS,
  FETCH_DASHBOARD_CARDS_BY_DUE_DATE_ERROR,
} from './../../actions/task.actions';

const fetchDashboardCardsByDueDateReducer: TaskReducer = (state, _) =>
  updateState(state, 'fetchDashboardCardsByDueDate', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
  });

const fetchDashboardCardsByDueDateSuccessReducer: TaskReducer = (state, action) => {
  const updatedCardsState = updateState(state, 'fetchDashboardCards', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload,
  });

  const newFetchCardsByProject = updateState(updatedCardsState, 'fetchDashboardCardsByProject', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: false,
  });

  return updateState(newFetchCardsByProject, 'fetchDashboardCardsByDueDate', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload,
  });
};

const fetchDashboardCardsByDueDateErrorReducer: TaskReducer = (state, action) =>
  updateState(state, 'fetchDashboardCardsByDueDate', <TaskStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

export const fetchDashboardCardsByDueDateReducerSlice = {
  [FETCH_DASHBOARD_CARDS_BY_DUE_DATE]: fetchDashboardCardsByDueDateReducer,
  [FETCH_DASHBOARD_CARDS_BY_DUE_DATE_SUCCESS]: fetchDashboardCardsByDueDateSuccessReducer,
  [FETCH_DASHBOARD_CARDS_BY_DUE_DATE_ERROR]: fetchDashboardCardsByDueDateErrorReducer,
};
