import { incrementNotificationsNumber, decrementNotificationsNumber} from './../actions/notifications.actions';
import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import {
  Notification, NotificationAction, FETCH_NOTIFICATIONS, fetchNotificationsError,
  fetchNotificationsSuccess, FetchNotificationsSuccess, LOAD_MORE_NOTIFICATIONS,
  loadMoreNotificationsError, LoadMoreNotificationsSuccess, loadMoreNotificationsSuccess,
  ParamsModel, CHANGE_NOTIFICATION_STATUS, changeNotificationStatus, ChangeNotificationStatus,
  changeNotificationStatusSuccess, ChangeNotificationStatusSuccess, changeNotificationStatusError,
  NotificationParams, fetchNotificationsNumber, fetchNotificationsNumberSuccess,
  fetchNotificationsNumberError, FETCH_NOTIFICATIONS_NUMBER, FetchNotificationsNumberSuccess,
  DEFAULT,
} from '../actions/notifications.actions';
import { TaskParams } from './../../tasks/actions/task.actions';
import { HttpInterceptor, ServerError } from '../../../providers/http.interceptor';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NotificationsEffects {

  @Effect() public fetchNotifications$ = this.actions$
    .ofType(FETCH_NOTIFICATIONS)
    .switchMap(this.fetchNotifications.bind(this));

  @Effect() public loadMoreNotifications$ = this.actions$
    .ofType(LOAD_MORE_NOTIFICATIONS)
    .map(toPayload)
    .switchMap(this.loadMoreNotifications.bind(this));

  @Effect() public changeNotificationStatus$ = this.actions$
    .ofType(CHANGE_NOTIFICATION_STATUS)
    .map<ChangeNotificationStatus, NotificationParams>(toPayload)
    .switchMap(this.changeNotificationStatus.bind(this));

  @Effect() public fetchNotificationsNumber$ = this.actions$
    .ofType(FETCH_NOTIFICATIONS_NUMBER)
    .switchMap(this.fetchNotificationsNumber.bind(this));

  constructor(private actions$: Actions, private http: HttpInterceptor) {}

  private fetchNotifications(): Observable<NotificationAction> {
    return this.http.get<Notification>('/notifications')
      .map<Notification, FetchNotificationsSuccess>(fetchNotificationsSuccess)
      .catch((error: ServerError) => Observable.of(fetchNotificationsError(error)));
  }

  private loadMoreNotifications(payload: ParamsModel): Observable<NotificationAction> {
    if (payload.page === 1) {
      return Observable.of({ type: DEFAULT });
    }

    return this.http.get('/notifications', { params: { page: payload.page } })
      .map<Notification, LoadMoreNotificationsSuccess>(loadMoreNotificationsSuccess)
      .catch((error: ServerError) => Observable.of(loadMoreNotificationsError(error)));
  }

  private changeNotificationStatus(params: NotificationParams): Observable<NotificationAction> {
    return this.http.put(`/notifications/${params.notificationId}`, { 'marked': params.isMarked})
      .map<any, ChangeNotificationStatusSuccess>(() => changeNotificationStatusSuccess(params))
      .catch((error: ServerError) => Observable.of(changeNotificationStatusError(error)));
  }

  private fetchNotificationsNumber(): Observable<NotificationAction> {
    return this.http.get<Notification>('/notifications')
      .map<Notification, FetchNotificationsNumberSuccess>(fetchNotificationsNumberSuccess)
      .catch((error: ServerError) => Observable.of(fetchNotificationsNumberError(error)));
  }
}
