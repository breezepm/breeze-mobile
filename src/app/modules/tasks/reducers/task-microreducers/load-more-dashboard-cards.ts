import { TaskReducer, TaskStateItem, initialStateItem } from '../task.reducer';
import { updateState } from '../../../../actions-utils';
import { pathOr } from 'ramda';
import {
  LOAD_MORE_DASHBOARD_CARDS,
  LOAD_MORE_DASHBOARD_CARDS_SUCCESS,
  LOAD_MORE_DASHBOARD_CARDS_ERROR,
  RESET_LOAD_MORE_DASHBOARD_CARDS,
} from './../../actions/task.actions';
import { addInitialPageToStages } from '../../../../helpers/add-initial-page-to-stages';

const loadMoreDashboardCardsReducer: TaskReducer = (state, _) =>
  updateState(state, 'loadMoreDashboardCards', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: null,
  });

const loadMoreDashboardCardsSuccessReducer: TaskReducer = (state, action) => {
  const currentTasksList = pathOr([], ['fetchDashboardCards', 'value'], state);
  const updatedTasksList = currentTasksList.concat(action.payload);

  const updatedFetchDashboardCardsState = updateState(state, 'fetchDashboardCards', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: addInitialPageToStages(updatedTasksList),
  });

  return updateState(updatedFetchDashboardCardsState, 'loadMoreDashboardCards', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload,
  });
};

const loadMoreDashboardCardsErrorReducer: TaskReducer = (state, action) =>
  updateState(state, 'loadMoreDashboardCards', <TaskStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

const resetLoadMoreDashboardCardsReducer: TaskReducer = (state, _) =>
  updateState(state, 'loadMoreDashboardCards', initialStateItem());

export const loadMoreDashboardCardsReducerSlice = {
  [LOAD_MORE_DASHBOARD_CARDS]: loadMoreDashboardCardsReducer,
  [LOAD_MORE_DASHBOARD_CARDS_SUCCESS]: loadMoreDashboardCardsSuccessReducer,
  [LOAD_MORE_DASHBOARD_CARDS_ERROR]: loadMoreDashboardCardsErrorReducer,
  [RESET_LOAD_MORE_DASHBOARD_CARDS]: resetLoadMoreDashboardCardsReducer,
};
