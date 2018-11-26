import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import { always, prop } from 'ramda';

import { IonicRxStorage } from './../../../shared/ionic-rx-storage/ionic-rx-storage.provider';
import { HttpInterceptor } from './../../../providers/http.interceptor';
import { UserCredentials } from './../../../models/user/user-credentials.model';
import {
  LOGIN, LOGOUT, SIGN_UP, FETCH_CURRENT_USER,
  FETCH_TEAM_USERS, SET_USER_TEAM_SUCCESS,
  loginSuccess, loginError,
  logoutSuccess, logoutError,
  signUpSuccess, signUpError, fetchCurrentUser,
  fetchCurrentUserSuccess, fetchCurrentUserError,
  fetchTeamUsersSuccess, fetchTeamUsersError,
  DEFAULT, LOGIN_WITH_GOOGLE, UserAction,
} from '../actions/user.actions';
import { fetchActivities } from './../../activity/actions/activity.actions';
import {
  fetchNotifications, fetchNotificationsNumber, loadMoreNotifications,
} from './../../activity/actions/notifications.actions';
import { fetchDashboardCards, fetchWidgets, resetPopoverState } from './../../tasks/actions/task.actions';
import { fetchProjects } from './../../projects/actions/project.actions';
import { GooglePlus } from '@ionic-native/google-plus';

@Injectable()
export class UserEffects {

  @Effect() public login$ = this.actions$
    .ofType(LOGIN)
    .map(toPayload)
    .switchMap(this.login.bind(this));

  @Effect() public logout$ = this.actions$
    .ofType(LOGOUT)
    .switchMap(this.logout.bind(this));

  @Effect() public signup$ = this.actions$
    .ofType(SIGN_UP)
    .map(toPayload)
    .switchMap(this.signUp.bind(this));

  @Effect() public fetchCurrentUser$ = this.actions$
    .ofType(FETCH_CURRENT_USER)
    .switchMap(() => this.storage.get('token'))
    .mergeMap(this.fetchCurrentUser.bind(this));

  @Effect() public fetchTeamUsers$ = this.actions$
    .ofType(FETCH_TEAM_USERS)
    .switchMap(this.fetchTeamUsers.bind(this));

  @Effect() public setUserTeam$ = this.actions$
    .ofType(SET_USER_TEAM_SUCCESS)
    .map(toPayload)
    .switchMap(this.setUserTeam.bind(this));

  @Effect() public loginWithGoogle$ = this.actions$
    .ofType(LOGIN_WITH_GOOGLE)
    .map(toPayload)
    .switchMap(this.loginWithGoogle.bind(this));

  constructor(
    private actions$: Actions,
    private http: HttpInterceptor,
    private storage: IonicRxStorage,
    private googlePlus: GooglePlus
  ) {}

  private login(user: UserCredentials): Observable<any> {
    return this.http.post('users/sign_in', { user })
      .switchMap(this.setCredentials.bind(this))
      .map(loginSuccess)
      .catch(err => Observable.of(loginError(err)));
  }

  private logout(): Observable<any> {
    const logoutFromGoogle$ = Observable
      .fromPromise(this.googlePlus.disconnect())
      .catch(err => Observable.of(logoutError(err)));

    const request$ = this.http.delete('users/sign_out')
      .map(always({ type: DEFAULT }))
      .catch(err => Observable.of(logoutError(err)));

    const logoutSuccess$ = Observable
      .of(logoutSuccess({ authentication_token: null }))
      .do(this.destroyCredentials.bind(this));

    return logoutSuccess$.concat(request$, logoutFromGoogle$);
  }

  private signUp(user: UserCredentials): Observable<Action> {
    return this.http.post('users', { user })
      .switchMap(this.setCredentials.bind(this))
      .map(signUpSuccess)
      .catch(err => Observable.of(signUpError(err)));
  }

  private fetchCurrentUser(token?: string): Observable<Action> {
    return token == null ?
      Observable.of(fetchCurrentUserError({ status: 401, statusText: 'unauthorized' })) :
      this.http.get('me')
        .map(fetchCurrentUserSuccess)
        .catch(err => Observable.of(fetchCurrentUserError(err)));
  }

  private fetchTeamUsers(): Observable<Action> {
    return this.http.get('teams')
      .map(fetchTeamUsersSuccess)
      .catch(err => Observable.of(fetchTeamUsersError(err)));
  }

  private setCredentials(res: any): Observable<any> {
    const token: string = res.authentication_token;
    this.http.setHeader('Authorization', token);
    return this.storage.set('token', token).mapTo(res);
  }

  private destroyCredentials(): Observable<any> {
    this.http.removeHeaders('Authorization', 'X_TEAM_ID');
    return this.storage.remove('token');
  }

  private setUserTeam(teamId: number): Observable<any> {
    this.http.removeHeaders('X_TEAM_ID');
    this.http.setHeader('X_TEAM_ID', teamId);
    return Observable.from([
      fetchCurrentUser(),
      resetPopoverState(),
      fetchDashboardCards(),
      fetchProjects(),
      fetchActivities(),
      fetchNotifications(),
      fetchNotificationsNumber(),
      loadMoreNotifications({ page: 1 }),
      fetchWidgets(),
    ]);
  }

  private loginWithGoogle(): Observable<Action> {
    const googleToken$ = Observable.fromPromise(
      this.googlePlus.login({
        scopes: webpackGlobalVars.GOOGLE_SCOPES,
        webClientId: webpackGlobalVars.GOOGLE_WEB_CLIENT_ID,
      })
    )
      .map(prop('idToken'))
      .catch(err => Observable.of(loginError(err)));

    return googleToken$
      .switchMap(token => this.http.post('account/google', { id_token: token }))
      .switchMap(this.setCredentials.bind(this))
      .map(loginSuccess)
      .catch(err => Observable.of(loginError(err)));
  }
}
