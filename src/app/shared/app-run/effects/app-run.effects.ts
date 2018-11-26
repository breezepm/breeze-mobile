import { Injectable } from '@angular/core';
import { pathOr } from 'ramda';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/concatMap';

import { HttpInterceptor } from './../../../providers/http.interceptor';
import { IonicRxStorage } from './../../ionic-rx-storage/ionic-rx-storage.provider';
import { AppRunAction, setRootPage, START_UP } from './../actions/app-run.actions';
import {
  fetchCurrentUser, LOGIN_SUCCESS, LoginSuccess, LOGOUT_SUCCESS, LogoutSuccess,
  SIGN_UP_SUCCESS, SignUpSuccess, setUserTeamSuccess,
} from './../../../modules/user/actions/user.actions';
import { fetchDashboardCards } from '../../../modules/tasks/actions/task.actions';
import {
  fetchNotificationsNumber, fetchNotifications,
} from './../../../modules/activity/actions/notifications.actions';

@Injectable()
export class AppRunEffects {
  @Effect() public rootPage$: Observable<AppRunAction> = this.actions$
    .ofType(START_UP)
    .switchMap(this.rootPage.bind(this));

  private isToken$: Observable<boolean> = this.storage.get('token')
    .map((token: string): boolean => {
      this.setAuthorizationHeader(token);
      return !!token;
    });

  private loginSuccess$: Observable<boolean> = this.actions$.ofType(LOGIN_SUCCESS)
    .let(isAuthToken);

  private signUpSuccess$: Observable<boolean> = this.actions$.ofType(SIGN_UP_SUCCESS)
    .let(isAuthToken);

  private logoutSuccess$: Observable<boolean> = this.actions$.ofType(LOGOUT_SUCCESS)
    .let(isAuthToken);

  constructor(private actions$: Actions, private storage: IonicRxStorage, private http: HttpInterceptor) {}

  private setAuthorizationHeader(token: string): void {
    if (token != null) {
      this.http.setHeader('Authorization', token);
    }
  }

  private rootPage(): Observable<AppRunAction> {
    const multipleActions = [
      setRootPage('TabsPage'),
      fetchCurrentUser(),
      fetchDashboardCards(),
      fetchNotifications(),
      fetchNotificationsNumber(),
      setUserTeamSuccess(),
    ];

    return Observable
      .merge(this.isToken$, this.loginSuccess$, this.signUpSuccess$, this.logoutSuccess$)
      .startWith(false)
      .concatMap((isAuth: boolean) =>
        isAuth ? Observable.from(multipleActions) : Observable.of(setRootPage('BrSignInPage'))
      );
  }

}

function isAuthToken(obs: Observable<any>): Observable<boolean> {
  return obs.map(pathOr<string>('', ['payload', 'authentication_token']))
    .map(Boolean);
}
