import { appRunReducer, initialState, AppRunState } from './app-run.reducer';
import {
  AppRunAction,
  startUp,
  setRootPage,
} from '../actions/app-run.actions';

describe('[reducer] appRunReducer', () => {

  describe('StartUp action', () => {

    it('should be called without a payload and perform no changes on the current state', () => {
      const action: AppRunAction = startUp();
      const currentState = appRunReducer(initialState, action);
      const expected: AppRunState = initialState;
      expect(currentState.rootPage).toBe(expected.rootPage);
    });
  });

  describe('SetRootPage action', () => {

    describe('[micro reducer] setRootPageReducer', () => {

      it('should return the state with the current value for "rootPage"', () => {
        const action: AppRunAction = setRootPage('TabsPage');
        const currentState = appRunReducer(initialState, action);
        const expected: AppRunState = { rootPage: 'TabsPage' };
        expect(currentState.rootPage).toBe(expected.rootPage);
      });

    });

  });

  describe('Unmatched action', () => {

    describe('[micro reducer] defaultReducer', () => {

      it('should return the current state if no action type is matched', () => {
        const action: AppRunAction = { type: 'I don\'t match', payload: undefined };
        const currentState = appRunReducer(initialState, action);
        const expected: AppRunState = initialState ;
        expect(currentState).toEqual(expected);
      });

    });

  });

});
