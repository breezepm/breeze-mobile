import { TaskReducer, TaskStateItem } from '../task.reducer';
import { updateState } from '../../../../actions-utils';
import {
  FETCH_DASHBOARD_USERS,
  FETCH_DASHBOARD_USERS_SUCCESS,
  FETCH_DASHBOARD_USERS_ERROR,
} from './../../actions/task.actions';

const fetchDashboardUsersReducer: TaskReducer = (state, _) =>
  updateState(state, 'fetchDashboardUsers', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
  });

const fetchDashboardUsersSuccessReducer: TaskReducer = (state, action) =>
  updateState(state, 'fetchDashboardUsers', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload,
  });

const fetchDashboardUsersErrorReducer: TaskReducer = (state, action) =>
  updateState(state, 'fetchDashboardUsers', <TaskStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

export const fetchDashboardUsersReducerSlice = {
  [FETCH_DASHBOARD_USERS]: fetchDashboardUsersReducer,
  [FETCH_DASHBOARD_USERS_SUCCESS]: fetchDashboardUsersSuccessReducer,
  [FETCH_DASHBOARD_USERS_ERROR]: fetchDashboardUsersErrorReducer,
};
