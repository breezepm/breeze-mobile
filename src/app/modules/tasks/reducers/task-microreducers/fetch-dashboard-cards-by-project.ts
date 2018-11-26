import { TaskReducer, TaskStateItem } from '../task.reducer';
import { updateState } from '../../../../actions-utils';
import {
  FETCH_DASHBOARD_CARDS_BY_PROJECT,
  FETCH_DASHBOARD_CARDS_BY_PROJECT_SUCCESS,
  FETCH_DASHBOARD_CARDS_BY_PROJECT_ERROR,
} from './../../actions/task.actions';
import { addInitialPageToStages } from '../../../../helpers/add-initial-page-to-stages';

const fetchDashboardCardsByProjectReducer: TaskReducer = (state, _) =>
  updateState(state, 'fetchDashboardCardsByProject', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
  });

const fetchDashboardCardsByProjectSuccessReducer: TaskReducer = (state, action) => {
  const updatedCardsState = updateState(state, 'fetchDashboardCards', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: addInitialPageToStages(action.payload),
  });

  const newFetchCardsByDueDate = updateState(updatedCardsState, 'fetchDashboardCardsByDueDate', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: false,
  });

  return updateState(newFetchCardsByDueDate, 'fetchDashboardCardsByProject', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: addInitialPageToStages(action.payload),
  });
};

const fetchDashboardCardsByProjectErrorReducer: TaskReducer = (state, action) =>
  updateState(state, 'fetchDashboardCardsByProject', <TaskStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

export const fetchDashboardCardsByProjectReducerSlice = {
  [FETCH_DASHBOARD_CARDS_BY_PROJECT]: fetchDashboardCardsByProjectReducer,
  [FETCH_DASHBOARD_CARDS_BY_PROJECT_SUCCESS]: fetchDashboardCardsByProjectSuccessReducer,
  [FETCH_DASHBOARD_CARDS_BY_PROJECT_ERROR]: fetchDashboardCardsByProjectErrorReducer,
};
