import { User, Team } from './../../../models/user/user-credentials.model';
import { updateState, Reducer } from '../../../actions-utils';
import {
  UserAction, DEFAULT, SET_USER_TEAM_SUCCESS,
  LOGIN, LOGIN_SUCCESS, LOGIN_ERROR,
  LOGOUT, LOGOUT_SUCCESS, LOGOUT_ERROR,
  SIGN_UP, SIGN_UP_SUCCESS, SIGN_UP_ERROR,
  RESET_SIGNUP_STATE, RESET_LOGIN_STATE,
  FETCH_CURRENT_USER, FETCH_CURRENT_USER_SUCCESS, FETCH_CURRENT_USER_ERROR,
  FETCH_TEAM_USERS, FETCH_TEAM_USERS_SUCCESS, FETCH_TEAM_USERS_ERROR,
} from '../actions/user.actions';

export interface UserStateItem {
  error: boolean;
  errorData: any;
  pending: boolean;
  success: boolean;
  value?: any;
}

export interface UserState {
  fetchCurrentUser: UserStateItem;
  fetchTeamUsers: UserStateItem;
  login: UserStateItem;
  logout: UserStateItem;
  signUp: UserStateItem;
  setUserTeam: UserStateItem;
}

type UserReducer = Reducer<UserState, UserAction>;

export const initialState: UserState = {

  fetchCurrentUser: <UserStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: false,
    value: null,
  }
,
  login: <UserStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: false,
    value: null,
  }
,
  logout: <UserStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: false,
  }
,
  signUp: <UserStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: false,
    value: null,
  }
,
  fetchTeamUsers: <UserStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: false,
    value: null,
  }
,
  setUserTeam: <UserStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: false,
    value: null,
  }
,
};

const resetSignupStateReducer: UserReducer = (state, _) =>
  updateState(state, 'signUp', <UserStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: false,
    value: null,
  });

const resetLoginStateReducer: UserReducer = (state, _) =>
  updateState(state, 'login', <UserStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: false,
    value: null,
  });

const loginReducer: UserReducer = (state, action) =>
  updateState(state, 'login', <UserStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload,
  });

const loginSuccessReducer: UserReducer = (state, action) =>
  updateState(state, 'login', <UserStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload,
  });

const loginErrorReducer: UserReducer = (state, action) =>
  updateState(state, 'login', <UserStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

const logoutReducer: UserReducer = (state, _) =>
  updateState(state, 'logout', <UserStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
  });

const logoutSuccessReducer: UserReducer = (state, _) =>
  updateState(state, 'logout', <UserStateItem> {
  error: false,
  errorData: null,
  pending: false,
  success: true,
});

const logoutErrorReducer: UserReducer = (state, action) =>
  updateState(state, 'logout', <UserStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
  });

const signUpReducer: UserReducer = (state, action) =>
  updateState(state, 'signUp', <UserStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload,
  });

const signUpSuccessReducer: UserReducer = (state, action) =>
  updateState(state, 'signUp', <UserStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload,
  });

const signUpErrorReducer: UserReducer = (state, action) =>
  updateState(state, 'signUp', <UserStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

const fetchCurrentUserReducer: UserReducer = (state, action) =>
  updateState(state, 'fetchCurrentUser', <UserStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload,
  });

const fetchCurrentUserSuccessReducer: UserReducer = (state, action) => {
  const user: User = action.payload;

  const realUserTeam: Team = {
    name: user.real_user_team_name,
    team_id: user.real_user_team_id,
    owner_email: '',
  };

  const userWithRealTeam: User = {
    ...user,
    teams: [ realUserTeam, ...user.teams ],
  };

  const newUserTeamId = updateState(state, 'setUserTeam', <UserStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: state.setUserTeam.value || user.real_user_team_id,
  });

  return updateState(newUserTeamId, 'fetchCurrentUser', <UserStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: userWithRealTeam,
  });
};

const fetchCurrentUserErrorReducer: UserReducer = (state, action) =>
  updateState(state, 'fetchCurrentUser', <UserStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

const fetchTeamUsersReducer: UserReducer = (state, action) =>
  updateState(state, 'fetchTeamUsers', <UserStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload,
  });

const fetchTeamUsersSuccessReducer: UserReducer = (state, action) =>
  updateState(state, 'fetchTeamUsers', <UserStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload,
  });

const fetchTeamUsersErrorReducer: UserReducer = (state, action) =>
  updateState(state, 'fetchTeamUsers', <UserStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

const setUserTeamSuccessReducer: UserReducer = (state, action) =>
  updateState(state, 'setUserTeam', <UserStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload,
  });

const defaultReducer: UserReducer = (state, _) => state;

const selectReducer = (actionType: string): UserReducer => {
  const actionToReducerMap = {
    [RESET_SIGNUP_STATE]: resetSignupStateReducer,
    [RESET_LOGIN_STATE]: resetLoginStateReducer,
    [LOGIN]: loginReducer,
    [LOGIN_SUCCESS]: loginSuccessReducer,
    [LOGIN_ERROR]: loginErrorReducer,
    [LOGOUT]: logoutReducer,
    [LOGOUT_SUCCESS]: logoutSuccessReducer,
    [LOGOUT_ERROR]: logoutErrorReducer,
    [SIGN_UP]: signUpReducer,
    [SIGN_UP_SUCCESS]: signUpSuccessReducer,
    [SIGN_UP_ERROR]: signUpErrorReducer,
    [FETCH_CURRENT_USER]: fetchCurrentUserReducer,
    [FETCH_CURRENT_USER_SUCCESS]: fetchCurrentUserSuccessReducer,
    [FETCH_CURRENT_USER_ERROR]: fetchCurrentUserErrorReducer,
    [FETCH_TEAM_USERS]: fetchTeamUsersReducer,
    [FETCH_TEAM_USERS_SUCCESS]: fetchTeamUsersSuccessReducer,
    [FETCH_TEAM_USERS_ERROR]: fetchTeamUsersErrorReducer,
    [SET_USER_TEAM_SUCCESS]: setUserTeamSuccessReducer,
    [DEFAULT]: defaultReducer,
  };
  return actionToReducerMap[actionType] || actionToReducerMap[DEFAULT];
};

export function userReducer(state = initialState, action) {
  const reducer: UserReducer = selectReducer(action.type);
  return reducer(state, action);
}
