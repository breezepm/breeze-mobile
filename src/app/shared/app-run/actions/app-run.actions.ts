/** Actions that need to run after the app loads shall be added here and handled in the effects. */

import { Action } from '@ngrx/store';

import { type, actionsDispatcher } from '../../../actions-utils';
import { RootPage } from './../reducers/app-run.reducer';
import { FetchCurrentUser } from './../../../modules/user/actions/user.actions';

export const START_UP = type('[AppRun] Start Up');
export const SET_ROOT_PAGE = type('[AppRun] Set Root Page');
export const DEFAULT = type('[AppRun] no action match');

interface StartUp extends Action {
  payload: any;
}

interface SetRootPage extends Action {
  payload: RootPage;
}

export type AppRunAction = SetRootPage | StartUp | FetchCurrentUser;

export const startUp = actionsDispatcher<any, AppRunAction>(START_UP);

export const setRootPage = actionsDispatcher<RootPage, AppRunAction>(SET_ROOT_PAGE);
