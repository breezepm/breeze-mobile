import { Action } from '@ngrx/store';

import { UserCredentials } from './../../../models/user/user-credentials.model';
import { type, actionsDispatcher } from '../../../actions-utils';

export const RESET_SIGNUP_STATE = type('[User] Reset sign up state');
export const RESET_LOGIN_STATE = type('[User] Reset login state');

export const DEFAULT = type('[User] No action match');

export const LOGIN = type('[User] Login');
export const LOGIN_SUCCESS = type('[User] Login Success');
export const LOGIN_ERROR = type('[User] Login Error');

export const LOGOUT = type('[User] Logout');
export const LOGOUT_SUCCESS = type('[User] Logout Success');
export const LOGOUT_ERROR = type('[User] Logout Error');

export const SIGN_UP = type('[User] Sign Up');
export const SIGN_UP_SUCCESS = type('[User] Sign Up Success');
export const SIGN_UP_ERROR = type('[User] Sign Up Error');

export const FETCH_CURRENT_USER = type('[User] Fetch Current User');
export const FETCH_CURRENT_USER_SUCCESS = type('[User] Fetch Current User Success');
export const FETCH_CURRENT_USER_ERROR = type('[User] Fetch Current User Error');

export const FETCH_TEAM_USERS = type('[User] Fetch Team Users');
export const FETCH_TEAM_USERS_SUCCESS = type('[User] Fetch Team Users Success');
export const FETCH_TEAM_USERS_ERROR = type('[User] Fetch Team Users Error');

export const SET_USER_TEAM_SUCCESS = type('[User] Set User Team Success');

export const LOGIN_WITH_GOOGLE = type('[User] Login with Google');

export interface User {
  id: number;
  name: string;
}

export interface GoogleLoginData {
  scopes: string;
  webClientId: string;
}

interface Login extends Action {
  payload: UserCredentials;
}

export interface LoginSuccess extends Action {
  payload: any;
}

interface LoginError extends Action {
  payload: any;
}

interface Logout extends Action {
  payload?: any;
}

export interface LogoutSuccess extends Action {
  payload: any;
}

interface LogoutError extends Action {
  payload?: any;
}

interface SignUp extends Action {
  payload: UserCredentials;
}

export interface SignUpSuccess extends Action {
  payload: any;
}

interface SignUpError extends Action {
  payload: any;
}

export interface FetchCurrentUser extends Action {
  payload?: any;
}

interface FetchCurrentUserSuccess extends Action {
  payload: any;
}

interface FetchCurrentUserError extends Action {
  payload: any;
}

interface FetchTeamUsers extends Action {
  payload?: any;
}

interface FetchTeamUsersSuccess extends Action {
  payload: any;
}

interface FetchTeamUsersError extends Action {
  payload: any;
}

interface SetUserTeamSuccess extends Action {
  payload: number;
}

interface LoginWithGoogle extends Action {
  payload: GoogleLoginData;
}

export type UserAction =
    Login
  | LoginSuccess
  | LoginError
  | Logout
  | LogoutSuccess
  | LogoutError
  | SignUp
  | SignUpSuccess
  | SignUpError
  | FetchCurrentUser
  | FetchCurrentUserSuccess
  | FetchCurrentUserError
  | FetchTeamUsers
  | FetchTeamUsersSuccess
  | FetchTeamUsersError
  | LoginWithGoogle
;

export const resetSignupState = actionsDispatcher<any, UserAction>(RESET_SIGNUP_STATE);
export const resetLoginState = actionsDispatcher<any, UserAction>(RESET_LOGIN_STATE);

export const login = actionsDispatcher<UserCredentials, UserAction>(LOGIN);
export const loginSuccess = actionsDispatcher<any, UserAction>(LOGIN_SUCCESS);
export const loginError = actionsDispatcher<any, UserAction>(LOGIN_ERROR);

export const signUp = actionsDispatcher<UserCredentials, UserAction>(SIGN_UP);
export const signUpSuccess = actionsDispatcher<any, UserAction>(SIGN_UP_SUCCESS);
export const signUpError = actionsDispatcher<any, UserAction>(SIGN_UP_ERROR);

export const logout = actionsDispatcher<any, UserAction>(LOGOUT);
export const logoutSuccess = actionsDispatcher<any, UserAction>(LOGOUT_SUCCESS);
export const logoutError = actionsDispatcher<any, UserAction>(LOGOUT_ERROR);

export const fetchCurrentUser = actionsDispatcher<any, UserAction>(FETCH_CURRENT_USER);
export const fetchCurrentUserSuccess = actionsDispatcher<any, UserAction>(FETCH_CURRENT_USER_SUCCESS);
export const fetchCurrentUserError = actionsDispatcher<any, UserAction>(FETCH_CURRENT_USER_ERROR);

export const fetchTeamUsers = actionsDispatcher<any, UserAction>(FETCH_TEAM_USERS);
export const fetchTeamUsersSuccess = actionsDispatcher<any, UserAction>(FETCH_TEAM_USERS_SUCCESS);
export const fetchTeamUsersError = actionsDispatcher<any, UserAction>(FETCH_TEAM_USERS_ERROR);

export const setUserTeamSuccess = actionsDispatcher<number, SetUserTeamSuccess>(SET_USER_TEAM_SUCCESS);
export const loginWithGoogle = actionsDispatcher<GoogleLoginData, UserAction>(LOGIN_WITH_GOOGLE);
