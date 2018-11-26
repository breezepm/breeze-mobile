import {
  ActivityAction, fetchActivities, fetchActivitiesError,
  fetchActivitiesSuccess, loadMoreActivities, loadMoreActivitiesError,
  loadMoreActivitiesSuccess,
} from '../actions/activity.actions';
import { activityReducer, ActivityStateItem, initialState, ActivityState } from './activity.reducer';

describe('[reducer] activityReducer', () => {

  describe('Fetch activities action', () => {

    describe('[micro reducer] fetchActivitiesReducer', () => {
      const testDescription = `should set true to "pending" and the action payload to "value" in
        the initialState.fetchActivities object`;

      it(testDescription, () => {
        const action = fetchActivities([{ audits: [], date_group: 'foo' }]);
        const currentState = activityReducer(initialState, action);
        const expected: ActivityStateItem = {
          value: null,
          pending: true,
          success: false,
          error: false,
          errorData: null,
        };
        expect(currentState.fetchActivities).toEqual(expected);
      });
    });

    describe('[micro reducer] fetchActivitiesSuccessReducer', () => {
      const testDescription = `should set success to "true" and the action payload to "value" in
        the initialState.fetchActivities object`;

      it(testDescription, () => {
        const action = fetchActivitiesSuccess([{ audits: [], date_group: 'foo' }]);
        const currentState = activityReducer(initialState, action);
        const expected: ActivityStateItem = {
          value: action.payload,
          pending: false,
          success: true,
          error: false,
          errorData: null,
        };
        expect(currentState.fetchActivities).toEqual(expected);
      });

    });

    describe('[micro reducer] fetchActivitiesErrorReducer', () => {
      const testDescription = `should set error to "true" and the action payload to "errorData" in
        the initialState.fetchActivities object`;

      it(testDescription, () => {
        const action = fetchActivitiesError({ status: 401, data: {} });
        const currentState = activityReducer(initialState, action);
        const expected: ActivityStateItem = {
          value: null,
          pending: false,
          success: false,
          error: true,
          errorData: action.payload,
        };
        expect(currentState.fetchActivities).toEqual(expected);
      });

    });
  });

  describe('Load more activities action', () => {
    describe('[micro reducer] loadMoreActivitiesReducer', () => {
      it('should set true to "pending" and the payload should be kept in store', () => {
        const action = loadMoreActivities({ page: 2 });
        const currentState = activityReducer(initialState, action);
        const expected: ActivityStateItem = {
          pending: true,
          success: false,
          error: false,
          errorData: null,
          value: action.payload,
        };
        expect(currentState.loadMoreActivities).toEqual(expected);
      });
    });

    describe('[micro reducer] loadMoreActivitiesSuccessReducer', () => {
      const testDescription = `should set true to "success" and the action payload should be http
        response in fetchActivities.value concatenated with the previous value`;

      it(testDescription, () => {
        const action = loadMoreActivitiesSuccess([ { audits: [], date_group: 'foo' } ]);
        const state = {
          ... initialState,
          fetchActivities: {
            error: false,
            errorData: null,
            pending: false,
            success: true,
            value: [{ audits: [], date_group: 'bar' }],
          },
        };
        const currentState = activityReducer(state, action);
        const expected: ActivityStateItem = {
          pending: false,
          success: true,
          error: false,
          errorData: null,
          value: state.fetchActivities.value.concat(action.payload),
        };
        expect(currentState.loadMoreActivities.success).toBe(true);
        expect(currentState.fetchActivities).toEqual(expected);
      });
    });

    describe('[micro reducer] loadMoreActivitiesErrorReducer', () => {

      it('should set true to "error" and the errorData should be set to payload in loadMoreActivities object', () => {
        const action = loadMoreActivitiesError({ status: 404, data: {} });

        const currentState = activityReducer(initialState, action);
        const expected: ActivityStateItem = {
          pending: false,
          success: false,
          error: true,
          errorData: action.payload,
          value: null,
        };
        expect(currentState.loadMoreActivities).toEqual(expected);
      });
    });
  });
});
