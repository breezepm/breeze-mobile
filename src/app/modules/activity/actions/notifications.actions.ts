import { TaskParams } from './../../tasks/actions/task.actions';
import { actionsDispatcher, type } from '../../../actions-utils';
import { Action } from '@ngrx/store';
import { ServerError } from '../../../providers/http.interceptor';

export const DEFAULT = type('[Notification] No action match');

export const FETCH_NOTIFICATIONS = type('[Notification] Fetch Notifications');
export const FETCH_NOTIFICATIONS_SUCCESS = type('[Notification] Fetch Notifications Success');
export const FETCH_NOTIFICATIONS_ERROR = type('[Notification] Fetch Notifications Error');

export const LOAD_MORE_NOTIFICATIONS = type('[Notification] Load More Notifications');
export const LOAD_MORE_NOTIFICATIONS_SUCCESS = type('[Notification] Load More Notifications Success');
export const LOAD_MORE_NOTIFICATIONS_ERROR = type('[Notification] Load More Notifications Error');

export const CHANGE_NOTIFICATION_STATUS = type('[Notification] Change Notification Status');
export const CHANGE_NOTIFICATION_STATUS_SUCCESS = type('[Notification] Change Notification Status Success');
export const CHANGE_NOTIFICATION_STATUS_ERROR = type('[Notification] Change Notification Status Error');

export const FETCH_NOTIFICATIONS_NUMBER = type('[Notification] Fetch Notifications Number');
export const FETCH_NOTIFICATIONS_NUMBER_SUCCESS = type('[Notification] Fetch Notifications Number Success');
export const FETCH_NOTIFICATIONS_NUMBER_ERROR = type('[Notification] Fetch Notifications Number Error');

export const DECREMENT_NOTIFICATIONS_NUMBER = type('[Notification] Decrement Notifications Number');
export const INCREMENT_NOTIFICATIONS_NUMBER = type('[Notification] Increment Notifications Number');

export interface NotificationParams {
  notificationId: number;
  isMarked: boolean;
}

export interface ParamsModel {
  page: number;
  userId?: number;
}

export interface NotificationItem {
  id: number;
  desc: string;
  marked: boolean;
  card_id: number;
  comment_id: number;
  created_at: string;
  read_only: boolean;
  creator: {
    id: number;
    email: string;
    name: string;
    avatar: string;
    initials: string;
    color: string;
  };
  project: {
    id: number;
    name: string;
  };
}

export interface Notification {
  notifications: NotificationItem[];
  unread_notifications: number;
}

export interface FetchNotifications extends Action {
  payload?: any;
}

export interface FetchNotificationsSuccess extends Action {
  payload: Notification;
}

export interface FetchNotificationsError extends Action {
  payload: ServerError;
}

export interface LoadMoreNotifications extends Action {
  payload: ParamsModel;
}

export interface LoadMoreNotificationsSuccess extends Action {
  payload: Notification;
}

export interface LoadMoreNotificationsError extends Action {
  payload: ServerError;
}

export interface ChangeNotificationStatus extends Action {
  payload: NotificationParams;
}

export interface ChangeNotificationStatusSuccess extends Action {
  payload: NotificationParams;
}

export interface ChangeNotificationStatusError extends Action {
  payload: ServerError;
}

export interface FetchNotificationsNumber extends Action {
  payload?: number;
}

export interface FetchNotificationsNumberSuccess extends Action {
  payload: Notification;
}

export interface FetchNotificationsNumberError extends Action {
  payload: ServerError;
}

export interface DecrementNotificationsNumber extends Action {
  payload?: number;
}

export interface IncrementNotificationsNumber extends Action {
  payload?: number;
}

export type NotificationAction =
  FetchNotifications
  | FetchNotificationsSuccess
  | FetchNotificationsError
  | LoadMoreNotifications
  | LoadMoreNotificationsSuccess
  | LoadMoreNotificationsError
  | ChangeNotificationStatus
  | ChangeNotificationStatusSuccess
  | ChangeNotificationStatusError
  | FetchNotificationsNumber
  | FetchNotificationsNumberSuccess
  | FetchNotificationsNumberError
  | DecrementNotificationsNumber
  | IncrementNotificationsNumber;

export const fetchNotifications =
  actionsDispatcher<any, FetchNotifications>(FETCH_NOTIFICATIONS);
export const fetchNotificationsSuccess =
  actionsDispatcher<Notification, FetchNotificationsSuccess>(FETCH_NOTIFICATIONS_SUCCESS);
export const fetchNotificationsError =
  actionsDispatcher<ServerError, FetchNotificationsError>(FETCH_NOTIFICATIONS_ERROR);

export const loadMoreNotifications =
  actionsDispatcher<ParamsModel, LoadMoreNotifications>(LOAD_MORE_NOTIFICATIONS);
export const loadMoreNotificationsSuccess =
  actionsDispatcher<Notification, LoadMoreNotificationsSuccess>(LOAD_MORE_NOTIFICATIONS_SUCCESS);
export const loadMoreNotificationsError =
  actionsDispatcher<ServerError, LoadMoreNotificationsError>(LOAD_MORE_NOTIFICATIONS_ERROR);

export const changeNotificationStatus =
  actionsDispatcher<NotificationParams, ChangeNotificationStatus>(CHANGE_NOTIFICATION_STATUS);
export const changeNotificationStatusSuccess =
  actionsDispatcher<NotificationParams, ChangeNotificationStatusSuccess>(CHANGE_NOTIFICATION_STATUS_SUCCESS);
export const changeNotificationStatusError =
  actionsDispatcher<ServerError, ChangeNotificationStatusError>(CHANGE_NOTIFICATION_STATUS_ERROR);

export const fetchNotificationsNumber =
  actionsDispatcher<any, FetchNotificationsNumber>(FETCH_NOTIFICATIONS_NUMBER);
export const fetchNotificationsNumberSuccess =
  actionsDispatcher<Notification, FetchNotificationsNumberSuccess>(FETCH_NOTIFICATIONS_NUMBER_SUCCESS);
export const fetchNotificationsNumberError =
  actionsDispatcher<ServerError, FetchNotificationsNumberError>(FETCH_NOTIFICATIONS_NUMBER_ERROR);

export const decrementNotificationsNumber =
  actionsDispatcher<any, DecrementNotificationsNumber>(DECREMENT_NOTIFICATIONS_NUMBER);

export const incrementNotificationsNumber =
  actionsDispatcher<any, DecrementNotificationsNumber>(INCREMENT_NOTIFICATIONS_NUMBER);
