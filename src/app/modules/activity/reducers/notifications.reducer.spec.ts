import {
  NotificationAction, fetchNotifications, fetchNotificationsError,
  fetchNotificationsSuccess, loadMoreNotifications, loadMoreNotificationsError,
  loadMoreNotificationsSuccess, fetchNotificationsNumber, NotificationItem,
  fetchNotificationsNumberSuccess, fetchNotificationsNumberError,
  incrementNotificationsNumber, decrementNotificationsNumber,
} from './../actions/notifications.actions';
import { notificationReducer, NotificationStateItem, initialState } from './notifications.reducer';

describe('[reducer] notificationReducer', () => {

  describe('Fetch notifications action', () => {

    describe('[micro reducer] fetchNotificationsReducer', () => {

      it(`should set true to "pending"`, () => {
        const action = fetchNotifications([ { data: [] } ]);
        const currentState = notificationReducer(initialState, action);
        const expectedState: NotificationStateItem = {
          error: false,
          errorData: null,
          pending: true,
          success: false,
          value: null,
        };
        expect(currentState.fetchNotifications).toEqual(expectedState);
      });

    });

    describe('[micro reducer] fetchNotificationsSuccessReducer', () => {

      const testDescription = `should set success to "true" and the notifications payload attribute to "value"
        in the initialState.fetchNotifications object`;

      it(testDescription, () => {
        const action = fetchNotificationsSuccess({
          notifications: [ { id: 1 } as NotificationItem ],
          unread_notifications: 1,
        });
        const currentState = notificationReducer(initialState, action);
        const expectedState: NotificationStateItem = {
          error: false,
          errorData: null,
          pending: false,
          success: true,
          value: action.payload.notifications,
        };
        expect(currentState.fetchNotifications).toEqual(expectedState);
      });
    });

    describe('[micro reducer] fetchNotificationsError', () => {

      const testDescription = `should set error to "true" and the action payload to "errorData"
        in the initialState.fetchNotifications object`;

      it(testDescription, () => {
        const action = fetchNotificationsError({ status: 401, data: 'bad luck!' });
        const currentState = notificationReducer(initialState, action);
        const expectedState: NotificationStateItem = {
          error: true,
          errorData: action.payload,
          pending: false,
          success: false,
          value: null,
        };
        expect(currentState.fetchNotifications).toEqual(expectedState);
      });

    });

  });

  describe('Load more notifications action', () => {

    describe('[micro reducer] loadMoreNotificationsReducer', () => {

      const testDescription = `should set pending to "true" and the action payload to "value"
        to the initialState.loadMoreNotifications object`;

      it(testDescription, () => {
        const action = loadMoreNotifications({ page: 2 });
        const currentState = notificationReducer(initialState, action);
        const expectedState: NotificationStateItem = {
          error: false,
          errorData: null,
          pending: true,
          success: false,
          value: action.payload,
        };
        expect(currentState.loadMoreNotifications).toEqual(expectedState);
      });

    });

    describe('[micro reducer] loadMoreNotificationsSuccessReducer', () => {

      const testDescription = `should set true to "success" and action payload to "value"
        in the loadMoreNotifications object`;

      it(testDescription, () => {
        const action = loadMoreNotificationsSuccess({
          notifications: [
            { id: 2 } as NotificationItem,
            { id: 3 } as NotificationItem,
          ],
          unread_notifications: 5,
        });
        const state = {
          ...initialState,
          fetchNotifications: {
            error: false,
            errorData: null,
            pending: false,
            success: true,
            value: [ { id: 1 } ],
          },
        };
        const currentState = notificationReducer(state, action);
        const expectedState: NotificationStateItem = {
          error: false,
          errorData: null,
          pending: false,
          success: true,
          value: [ { id: 1 }, { id: 2 }, { id: 3 } ],
        };
        expect(currentState.fetchNotifications).toEqual(expectedState);
      });

    });

    describe('[micro reducer] loadMoreNotificationsErrorReducer', () => {

      const testDescription = `should set error to "true" and the action payload to "errorData"
        in the initialState.fetchNotifications object`;

      it(testDescription, () => {
        const action = loadMoreNotificationsError({ status: 401, data: {} });
        const currentState = notificationReducer(initialState, action);
        const expectedState: NotificationStateItem = {
          error: true,
          errorData: action.payload,
          pending: false,
          success: false,
          value: null,
        };
        expect(currentState.loadMoreNotifications).toEqual(expectedState);
      });

    });
  });

  describe('Fetch notifications number action', () => {

    const stateWithNoNotifications = {
      ...initialState,
      notificationsNumber: <NotificationStateItem> {
        error: false,
        errorData: null,
        pending: false,
        success: false,
        value: 0,
      },
    };

    describe('[micro reducer] fetchNotificationNumberReducer', () => {

      const testDescription = `should set pending to "true" and value to notifications number from current state`;

      it(testDescription, () => {
        const action = fetchNotificationsNumber();
        const currentState = notificationReducer(stateWithNoNotifications, action);
        const expectedState: NotificationStateItem = {
          error: false,
          errorData: null,
          pending: true,
          success: false,
          value: 0,
        };
        expect(currentState.notificationsNumber).toEqual(expectedState);
      });

    });

    describe('[micro reducer] fetchNotificationNumberSuccessReducer', () => {

      const testDescription = `should set true to "pending" and the action payload to "value"
        in the initialState.fetchNotifications object`;

      it(testDescription, () => {
        const action = fetchNotificationsNumberSuccess({ notifications: [], unread_notifications: 2 });
        const currentState = notificationReducer(initialState, action);
        const expectedState: NotificationStateItem = {
          error: false,
          errorData: null,
          pending: false,
          success: true,
          value: action.payload.unread_notifications,
        };
        expect(currentState.notificationsNumber).toEqual(expectedState);
      });

    });

    describe('[micro reducer] fetchNotificationNumberErrorReducer', () => {

      const testDescription = `should set error to "true" and the action payload to "errorData"
        in the initialState.fetchNotifications object`;

      it(testDescription, () => {
        const action = fetchNotificationsNumberError({ status: 404, data: 'oh no...' });
        const currentState = notificationReducer(initialState, action);
        const expectedState: NotificationStateItem = {
          error: true,
          errorData: action.payload,
          pending: false,
          success: false,
          value: null,
        };
        expect(currentState.notificationsNumber).toEqual(expectedState);
      });

    });
  });

  describe('Increment notifications number action', () => {

    const stateWithUnreadNotification = {
      ...initialState,
      notificationsNumber: <NotificationStateItem> {
        error: false,
        errorData: null,
        pending: false,
        success: false,
        value: 1,
      },
    };

    it(`should set succsess to "true" and add one to the value`, () => {
      const action = incrementNotificationsNumber();
      const currentState = notificationReducer(stateWithUnreadNotification, action);
      const expectedState: NotificationStateItem = {
        error: false,
        errorData: null,
        pending: false,
        success: true,
        value: 2,
      };
      expect(currentState.notificationsNumber).toEqual(expectedState);
    });
  });

  describe('Decrement notifications number action', () => {

    const stateWithUnreadNotification = {
      ...initialState,
      notificationsNumber: <NotificationStateItem> {
        error: false,
        errorData: null,
        pending: false,
        success: false,
        value: 1,
      },
    };

    it(`should set succsess to "true" and subtract one from the value`, () => {
      const action = decrementNotificationsNumber();
      const currentState = notificationReducer(stateWithUnreadNotification, action);
      const expectedState: NotificationStateItem = {
        error: false,
        errorData: null,
        pending: false,
        success: true,
        value: 0,
      };
      expect(currentState.notificationsNumber).toEqual(expectedState);
    });
  });
});
