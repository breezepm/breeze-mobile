import { updateState, Reducer } from '../../../actions-utils';
import { SET_ROOT_PAGE, DEFAULT, AppRunAction } from './../actions/app-run.actions';

export type RootPage = 'BrSignInPage' | 'TabsPage';

type AppRunReducer = Reducer<AppRunState, AppRunAction>;

export interface AppRunState {
  rootPage: RootPage;
}

export const initialState: AppRunState = {
  rootPage: 'BrSignInPage',
};

const setRootPageReducer: AppRunReducer = (state, action) =>
  updateState(state, 'rootPage', action.payload as RootPage);

const defaultReducer: AppRunReducer = (state, _) => state;

const selectReducer = (actionType: string): AppRunReducer => {
  const actionToReducerMap = {
    [SET_ROOT_PAGE]: setRootPageReducer,
    [DEFAULT]: defaultReducer,
  };
  return actionToReducerMap[actionType] || actionToReducerMap[DEFAULT];
};

export function appRunReducer(state = initialState, action) {
  const reducer = selectReducer(action.type);
  return reducer(state, action);
}
