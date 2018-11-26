import { TaskReducer, TaskStateItem } from '../task.reducer';
import { updateState } from '../../../../actions-utils';
import {
  FETCH_DASHBOARD_CARDS,
  FETCH_DASHBOARD_CARDS_SUCCESS,
  FETCH_DASHBOARD_CARDS_ERROR,
} from './../../actions/task.actions';
import { addInitialPageToStages } from '../../../../helpers/add-initial-page-to-stages';

const fetchDashboardCardsReducer: TaskReducer = (state, _) =>
  updateState(state, 'fetchDashboardCards', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
  });

const fetchDashboardCardsSuccessReducer: TaskReducer = (state, action) =>
  updateState(state, 'fetchDashboardCards', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: addInitialPageToStages(action.payload),
  });

const fetchDashboardCardsErrorReducer: TaskReducer = (state, action) =>
  updateState(state, 'fetchDashboardCards', <TaskStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

export const fetchDashboardCardsReducerSlice = {
  [FETCH_DASHBOARD_CARDS]: fetchDashboardCardsReducer,
  [FETCH_DASHBOARD_CARDS_SUCCESS]: fetchDashboardCardsSuccessReducer,
  [FETCH_DASHBOARD_CARDS_ERROR]: fetchDashboardCardsErrorReducer,
};
