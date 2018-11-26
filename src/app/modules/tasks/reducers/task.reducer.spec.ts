import {
  FETCH_DASHBOARD_CARDS, FETCH_DASHBOARD_CARDS_ERROR, FETCH_DASHBOARD_CARDS_SUCCESS, FetchDashboardCards,
  FetchDashboardCardsError, FetchDashboardCardsSuccess, LOAD_MORE_DASHBOARD_CARDS, LOAD_MORE_DASHBOARD_CARDS_ERROR,
  LOAD_MORE_DASHBOARD_CARDS_SUCCESS,
  LoadMoreDashboardCards, LoadMoreDashboardCardsError, LoadMoreDashboardCardsSuccess,
} from '../actions/task.actions';
import { initialState, taskReducer, TaskStateItem } from './task.reducer';
import { dashboardCardMock } from '../../../../mocks/dashboard-card.mock';
import { addInitialPageToStages } from '../../../helpers/add-initial-page-to-stages';

describe('[reducer] taskReducer', () => {
  describe('Fetch dashboard cards action', () => {
    describe('[micro reducer] fetchDashboardCards', () => {
      const testDescription = `should set true to "pending" and the action payload to "value" in the
        initialState.fetchDashboardCards object`;

      it(testDescription, () => {
        const action: FetchDashboardCards = { type: FETCH_DASHBOARD_CARDS };
        const currentState = taskReducer(initialState, action);
        const expected: TaskStateItem = {
          pending: true,
          success: false,
          error: false,
          errorData: null,
        };
        expect(currentState.fetchDashboardCards).toEqual(expected);
      });
    });

    describe('[micro reducer] fetchDashboardCardsSuccessReducer', () => {
      const taskDescription = `should set success to "true" and the action payload to "value" in the
        initialState.fetchDashboardCards object`;

      it(taskDescription, () => {
        const action: FetchDashboardCardsSuccess = {
          type: FETCH_DASHBOARD_CARDS_SUCCESS,
          payload: [dashboardCardMock],
        };
        const currentState = taskReducer(initialState, action);
        const expected: TaskStateItem = {
          value: addInitialPageToStages(action.payload),
          pending: false,
          success: true,
          error: false,
          errorData: null,
        };
        expect(currentState.fetchDashboardCards).toEqual(expected);
      });
    });

    describe('[micro reducer] fetchDashboardCardsErrorReducer', () => {
      const testDescription = `should set error to "true" and the action payload to "errorData" in the
        initialState.fetchDashboardCards object`;

      it(testDescription, () => {
        const action: FetchDashboardCardsError = {
          type: FETCH_DASHBOARD_CARDS_ERROR,
          payload: { status: 401, data: {} },
        };
        const currentState = taskReducer(initialState, action);
        const expected: TaskStateItem = {
          value: null,
          pending: false,
          success: false,
          error: true,
          errorData: action.payload,
        };
        expect(currentState.fetchDashboardCards).toEqual(expected);
      });
    });
  });

  describe('Load more dashboard cards action', () => {
    describe('[micro reducer] loadMoreDashboardCardsReducer', () => {
      const taskDescription = `should set true to "pending" and the action payload to "value" in
        the initialState.loadMoreDashboardCards object`;

      it(taskDescription, () => {
        const action: LoadMoreDashboardCards = { type: LOAD_MORE_DASHBOARD_CARDS, payload: { group: 'project' }};
        const currentState = taskReducer(initialState, action);
        const expected: TaskStateItem = {
          pending: true,
          success: false,
          error: false,
          errorData: null,
          value: null,
        };
        expect(currentState.loadMoreDashboardCards).toEqual(expected);
      });
    });

    describe('[micro reducer] loadMoreDashboardCardsSuccessReducer', () => {
      const testDescription = `should set success to "true" and the action payload to "value" in
        the initialState.loadMoreDashboardCards object`;

      it(testDescription, () => {
        const action: LoadMoreDashboardCardsSuccess = {
          type: LOAD_MORE_DASHBOARD_CARDS_SUCCESS,
          payload: [dashboardCardMock],
        };
        const currentState = taskReducer(initialState, action);
        const expected: TaskStateItem = {
          value: action.payload,
          pending: false,
          success: true,
          error: false,
          errorData: null,
        };
        expect(currentState.loadMoreDashboardCards).toEqual(expected);
      });
    });

    describe('[micro reducer] loadMoreDashboardCardsErrorReducer', () => {
      const testDescription = `should set error to "true" and the action payload to "errorData" in
        the initialState.loadMoreDashboardCards object`;

      it(testDescription, () => {
        const action: LoadMoreDashboardCardsError = {
          type: LOAD_MORE_DASHBOARD_CARDS_ERROR,
          payload: { status: 401, data: {} },
        };
        const currentState = taskReducer(initialState, action);
        const expected: TaskStateItem = {
          value: null,
          pending: false,
          success: false,
          error: true,
          errorData: action.payload,
        };
        expect(currentState.loadMoreDashboardCards).toEqual(expected);
      });
    });
  });
});
