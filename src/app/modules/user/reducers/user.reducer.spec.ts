import { userReducer, initialState, UserState, UserStateItem } from './user.reducer';
import {
  UserAction,
  LOGIN, LOGIN_SUCCESS, LOGIN_ERROR,
  LOGOUT, LOGOUT_SUCCESS, LOGOUT_ERROR,
  SIGN_UP, SIGN_UP_SUCCESS, SIGN_UP_ERROR,
  FETCH_CURRENT_USER, FETCH_CURRENT_USER_SUCCESS, FETCH_CURRENT_USER_ERROR, FETCH_TEAM_USERS, FETCH_TEAM_USERS_SUCCESS,
  FETCH_TEAM_USERS_ERROR,
} from '../actions/user.actions';

describe('[reducer] userReducer', () => {

  describe('Login action', () => {

    describe('[micro reducer] loginReducer', () => {

      it('should set true to "pending" and the action payload to "value" in the initialState.login object', () => {
        const action: UserAction = { type: LOGIN, payload: { email: 'ja@ja.pl' } };
        const currentState = userReducer(initialState, action);
        const expected: UserStateItem = {
          value: action.payload,
          pending: true,
          success: false,
          error: false,
          errorData: null,
        };
        expect(currentState.login).toEqual(expected);
      });

    });

    describe('[micro reducer] loginSuccessReducer', () => {

      it('should set success to "true" and the action payload to "value" in the initialState.login object', () => {
        const action: UserAction = { type: LOGIN_SUCCESS, payload: { name: 'Ja' } };
        const currentState = userReducer(initialState, action);
        const expected: UserStateItem = {
          value: action.payload,
          pending: false,
          success: true,
          error: false,
          errorData: null,
        };
        expect(currentState.login).toEqual(expected);
      });

    });

    describe('[micro reducer] loginErrorReducer', () => {

      it('should set error to "true" and the action payload to "errorData" in the initialState.login object', () => {
        const action: UserAction = { type: LOGIN_ERROR, payload: { status: 401 } };
        const currentState = userReducer(initialState, action);
        const expected: UserStateItem = {
          value: null,
          pending: false,
          success: false,
          error: true,
          errorData: action.payload,
        };
        expect(currentState.login).toEqual(expected);
      });

    });

  });

  describe('Sign Up action', () => {

    describe('[micro reducer] signUpReducer', () => {

      it('should set true to "pending" and the action payload to "value" in the initialState.signUp object', () => {
        const action: UserAction = { type: SIGN_UP, payload: { email: 'ty@ty.pl' } };
        const currentState = userReducer(initialState, action);
        const expected: UserStateItem = {
          value: action.payload,
          pending: true,
          success: false,
          error: false,
          errorData: null,
        };
        expect(currentState.signUp).toEqual(expected);
      });

    });

    describe('[micro reducer] signUpSuccessReducer', () => {

      it('should set success to "true" and the action payload to "value" in the initialState.signUp object', () => {
        const action: UserAction = { type: SIGN_UP_SUCCESS, payload: { name: 'Ty' } };
        const currentState = userReducer(initialState, action);
        const expected: UserStateItem = {
          value: action.payload,
          pending: false,
          success: true,
          error: false,
          errorData: null,
        };
        expect(currentState.signUp).toEqual(expected);
      });

    });

    describe('[micro reducer] signUpErrorReducer', () => {

      it('should set error to "true" and the action payload to "errorData" in the initialState.signUp object', () => {
        const action: UserAction = { type: SIGN_UP_ERROR, payload: { status: 402 } };
        const currentState = userReducer(initialState, action);
        const expected: UserStateItem = {
          value: null,
          pending: false,
          success: false,
          error: true,
          errorData: action.payload,
        };
        expect(currentState.signUp).toEqual(expected);
      });

    });

  });

  describe('Fetch current user action', () => {

    describe('[micro reducer] fetchCurrentUserReducer', () => {
      const testDescription =
        'should set true to "pending" and the action payload to "value" in the initialState.fetchCurrentUser object';

      it(testDescription, () => {
        const action: UserAction = { type: FETCH_CURRENT_USER, payload: null };
        const currentState = userReducer(initialState, action);
        const expected: UserStateItem = {
          value: action.payload,
          pending: true,
          success: false,
          error: false,
          errorData: null,
        };
        expect(currentState.fetchCurrentUser).toEqual(expected);
      });

    });

    describe('[micro reducer] fetchCurrentUserSuccessReducer', () => {
      const testDescription =
        `should set success to "true", update action payload and set user with combined teams
        to "value" in the initialState.fetchCurrentUser object`;

      it(testDescription, () => {
        const action: UserAction = {
          type: FETCH_CURRENT_USER_SUCCESS,
          payload: {
            name: 'Ona',
            real_user_team_id: '123',
            real_user_team_name: 'team1',
            teams: [ { name: 'team2', team_id: '456', owner_email: ''} ],
          },
        };
        const userWithCombinedTeams = {
          ...action.payload,
          teams: [
            { name: 'team1', team_id: '123', owner_email: '' },
            { name: 'team2', team_id: '456', owner_email: '' },
          ],
        };
        const currentState = userReducer(initialState, action);
        const expected: UserStateItem = {
          value: userWithCombinedTeams,
          pending: false,
          success: true,
          error: false,
          errorData: null,
        };
        expect(currentState.fetchCurrentUser).toEqual(expected);
      });

    });

    describe('[micro reducer] fetchCurrentUserErrorReducer', () => {
      const testDescription =
        'should set error to "true" and the action payload to "errorData" in the initialState.fetchCurrentUser object';

      it(testDescription, () => {
        const action: UserAction = { type: FETCH_CURRENT_USER_ERROR, payload: { status: 403 } };
        const currentState = userReducer(initialState, action);
        const expected: UserStateItem = {
          value: null,
          pending: false,
          success: false,
          error: true,
          errorData: action.payload,
        };
        expect(currentState.fetchCurrentUser).toEqual(expected);
      });

    });

  });

  describe('Fetch team users action', () => {
    describe('[micro reducer] fetchTeamUsersReducer', () => {
      const testDescription =
        'should set true to "pending" and the action payload to "value" in the initialState.fetchTeamUsers object';

      it(testDescription, () => {
        const action: UserAction = { type: FETCH_TEAM_USERS, payload: null };
        const currentState = userReducer(initialState, action);
        const expected: UserStateItem = {
          value: action.payload,
          pending: true,
          success: false,
          error: false,
          errorData: null,
        };
        expect(currentState.fetchTeamUsers).toEqual(expected);
      });

    });

    describe('[micro reducer] fetchTeamUsersSuccessReducer', () => {
      const testDescription =
        'should set success to "true" and the action payload to "value" in the initialState.fetchTeamUsers object';

      it(testDescription, () => {
        const action: UserAction = { type: FETCH_TEAM_USERS_SUCCESS, payload: { name: 'Ona' } };
        const currentState = userReducer(initialState, action);
        const expected: UserStateItem = {
          value: action.payload,
          pending: false,
          success: true,
          error: false,
          errorData: null,
        };
        expect(currentState.fetchTeamUsers).toEqual(expected);
      });

    });

    describe('[micro reducer] fetchTeamUsersErrorReducer', () => {
      const testDescription =
        'should set error to "true" and the action payload to "value" in the initialState.fetchTeamUsers object';

      it(testDescription, () => {
        const action: UserAction = { type: FETCH_TEAM_USERS_ERROR, payload: { status: 403 } };
        const currentState = userReducer(initialState, action);
        const expected: UserStateItem = {
          value: null,
          pending: false,
          success: false,
          error: true,
          errorData: action.payload,
        };
        expect(currentState.fetchTeamUsers).toEqual(expected);
      });

    });
  });

  describe('Logout action', () => {

    describe('[micro reducer] logoutReducer', () => {

      it('should set true to "pending" in the initialState.logout object', () => {
        const action: UserAction = { type: LOGOUT, payload: null };
        const currentState = userReducer(initialState, action);
        const expected: UserStateItem = {
          pending: true,
          success: false,
          error: false,
          errorData: null,
        };
        expect(currentState.logout).toEqual(expected);
      });

    });

    describe('[micro reducer] logoutSuccessReducer', () => {

      it('should set success to "true" in the initialState.logout object', () => {
        const action: UserAction = { type: LOGOUT_SUCCESS, payload: null };
        const currentState = userReducer(initialState, action);
        const expected: UserStateItem = {
          pending: false,
          success: true,
          error: false,
          errorData: null,
        };
        expect(currentState.logout).toEqual(expected);
      });

    });

    describe('[micro reducer] logoutErrorReducer', () => {
      const testDescription =
        'should set error to "true" and the action payload to "errorData" in the initialState.fetchCurrentUser object';

      it(testDescription, () => {
        const action: UserAction = { type: LOGOUT_ERROR, payload: { status: 404 } };
        const currentState = userReducer(initialState, action);
        const expected: UserStateItem = {
          pending: false,
          success: false,
          error: true,
          errorData: action.payload,
        };
        expect(currentState.logout).toEqual(expected);
      });

    });

  });

  describe('Unmatched action', () => {

    describe('[micro reducer] defaultReducer', () => {

      it('should return the current state if no action type is matched', () => {
        const action: UserAction = { type: 'I dont match', payload: null };
        const currentState = userReducer(initialState, action);
        const expected: UserState = initialState ;
        expect(currentState).toEqual(expected);
      });

    });

  });

});
