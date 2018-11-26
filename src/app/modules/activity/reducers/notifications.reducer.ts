import { Reducer, updateState } from '../../../actions-utils';
import {
  Notification, NotificationAction,
  DEFAULT, FETCH_NOTIFICATIONS, FETCH_NOTIFICATIONS_ERROR, FETCH_NOTIFICATIONS_SUCCESS,
  LOAD_MORE_NOTIFICATIONS, LOAD_MORE_NOTIFICATIONS_ERROR, LOAD_MORE_NOTIFICATIONS_SUCCESS,
  CHANGE_NOTIFICATION_STATUS, CHANGE_NOTIFICATION_STATUS_SUCCESS, CHANGE_NOTIFICATION_STATUS_ERROR,
  FETCH_NOTIFICATIONS_NUMBER, FETCH_NOTIFICATIONS_NUMBER_SUCCESS, FETCH_NOTIFICATIONS_NUMBER_ERROR,
  DECREMENT_NOTIFICATIONS_NUMBER, INCREMENT_NOTIFICATIONS_NUMBER
} from '../actions/notifications.actions';
import { convertUserColorToHex } from '../../../helpers/convert-user-color-to-hex';
import { ifElse, lt, lte, dec, inc, always, both, is, assoc, pathSatisfies } from 'ramda';
import { mapWhenPropsEq } from './../../../helpers/map-when-props-eq';

export interface NotificationStateItem {
  error: boolean;
  errorData: any;
  pending: boolean;
  success: boolean;
  value?: any;
}

export interface NotificationState {
  fetchNotifications: NotificationStateItem;
  loadMoreNotifications: NotificationStateItem;
  canLoadMoreNotifications: NotificationStateItem;
  changeNotificationStatus: NotificationStateItem;
  notificationsNumber: NotificationStateItem;
}

export const initialState: NotificationState = {
  fetchNotifications: <NotificationStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: false,
    value: null,
  },
  loadMoreNotifications: <NotificationStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: false,
    value: null,
  },
  canLoadMoreNotifications: <NotificationStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: false,
    value: null,
  },
  changeNotificationStatus: <NotificationStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: false,
    value: null,
  },
  notificationsNumber: <NotificationStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: false,
    value: null,
  },
};

type NotificationReducer = Reducer<NotificationState, NotificationAction>;

const canLoadMoreSuccessReducer: NotificationReducer = (state, action) =>
  updateState(state, 'canLoadMoreNotifications', <NotificationStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: pathSatisfies(lt(0), ['payload', 'notifications', 'length'], action),
  });

const fetchNotificationsReducer: NotificationReducer = (state, _) =>
  updateState(state, 'fetchNotifications', <NotificationStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: null,
  });

const fetchNotificationsSuccessReducer: NotificationReducer = (state, action) => {
  const canLoadMoreState = canLoadMoreSuccessReducer(state, action);

  return updateState(canLoadMoreState, 'fetchNotifications', <NotificationStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload.notifications,
  });
};

const fetchNotificationsErrorReducer: NotificationReducer = (state, action) =>
  updateState(state, 'fetchNotifications', <NotificationStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: state.fetchNotifications.value,
  });

const loadMoreNotificationsReducer: NotificationReducer = (state, action) =>
  updateState(state, 'loadMoreNotifications', <NotificationStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload, // Last fetched page
  });

const loadMoreNotificationsSuccessReducer: NotificationReducer = (state, action) => {
  const canLoadMoreState = canLoadMoreSuccessReducer(state, action);

  const newFetchedNotifications = updateState(canLoadMoreState, 'fetchNotifications', <NotificationStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: state.fetchNotifications.value.concat(action.payload.notifications),
  });

  return updateState(newFetchedNotifications, 'loadMoreNotifications', <NotificationStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: state.loadMoreNotifications.value, // Last fetched page
  });
};

const loadMoreNotificationsErrorReducer: NotificationReducer = (state, action) =>
  updateState(state, 'loadMoreNotifications', <NotificationStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: state.loadMoreNotifications.value, // Last fetched page
  });

const changeNotificationStatusReducer: NotificationReducer = (state, action) => {
  const { isMarked, notificationId } = action.payload;
  const updateMarkedItem = mapWhenPropsEq({ id: notificationId }, assoc('marked', isMarked));

  return updateState(state, 'fetchNotifications', <NotificationStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: updateMarkedItem(state.fetchNotifications.value),
  });
};

const changeNotificationStatusSuccessReducer: NotificationReducer = (state, action) => {

  return updateState(state, 'fetchNotifications', <NotificationStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: state.fetchNotifications.value,
  });
};

const changeNotificationStatusErrorReducer: NotificationReducer = (state, action) =>
  updateState(state, 'changeNotificationStatus', <NotificationStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: state.changeNotificationStatus.value,
  });

const fetchNotificationsNumberReducer: NotificationReducer = (state, action) =>

  updateState(state, 'notificationsNumber', <NotificationStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: state.notificationsNumber.value,
  });

const fetchNotificationsNumberSuccessReducer: NotificationReducer = (state, action) =>
  updateState(state, 'notificationsNumber', <NotificationStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload.unread_notifications,
  });

const fetchNotificationsNumberErrorReducer: NotificationReducer = (state, action) =>
  updateState(state, 'notificationsNumber', <NotificationStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: state.notificationsNumber.value,
  });

const decrementNotificationsNumberReducer: NotificationReducer = (state, action) => {

  const isPositive = both(is(Number), lt(0));
  const decNotificationsNumber = ifElse(isPositive, dec, always(0));

  return updateState(state, 'notificationsNumber', <NotificationStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: decNotificationsNumber(state.notificationsNumber.value),
  });
};

const incrementNotificationsNumberReducer: NotificationReducer = (state, action) => {

  const incNotificationsNumber = ifElse(both(is(Number), lte(0)), inc, always(0));

  return updateState(state, 'notificationsNumber', <NotificationStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: incNotificationsNumber(state.notificationsNumber.value),
  });
};

const defaultReducer: NotificationReducer = (state, _) => state;

const selectReducer = (actionType: string): NotificationReducer => {
  const actionToReducerMap = {
    [FETCH_NOTIFICATIONS]: fetchNotificationsReducer,
    [FETCH_NOTIFICATIONS_SUCCESS]: fetchNotificationsSuccessReducer,
    [FETCH_NOTIFICATIONS_ERROR]: fetchNotificationsErrorReducer,
    [LOAD_MORE_NOTIFICATIONS]: loadMoreNotificationsReducer,
    [LOAD_MORE_NOTIFICATIONS_SUCCESS]: loadMoreNotificationsSuccessReducer,
    [LOAD_MORE_NOTIFICATIONS_ERROR]: loadMoreNotificationsErrorReducer,
    [CHANGE_NOTIFICATION_STATUS]: changeNotificationStatusReducer,
    [CHANGE_NOTIFICATION_STATUS_SUCCESS]: changeNotificationStatusSuccessReducer,
    [CHANGE_NOTIFICATION_STATUS_ERROR]: changeNotificationStatusErrorReducer,
    [FETCH_NOTIFICATIONS_NUMBER]: fetchNotificationsNumberReducer,
    [FETCH_NOTIFICATIONS_NUMBER_SUCCESS]: fetchNotificationsNumberSuccessReducer,
    [FETCH_NOTIFICATIONS_NUMBER_ERROR]: fetchNotificationsNumberErrorReducer,
    [DECREMENT_NOTIFICATIONS_NUMBER]: decrementNotificationsNumberReducer,
    [INCREMENT_NOTIFICATIONS_NUMBER]: incrementNotificationsNumberReducer,
    [DEFAULT]: defaultReducer,
  };
  return actionToReducerMap[actionType] || actionToReducerMap[DEFAULT];
};

export function notificationReducer(state = initialState, action) {
  const reducer: NotificationReducer = selectReducer(action.type);
  return reducer(state, action);
}
