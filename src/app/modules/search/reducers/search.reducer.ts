import { Reducer, updateState } from '../../../actions-utils';
import {
  CLEAR_SEARCH_RESULTS,
  DEFAULT, LOAD_MORE_SEARCH_ITEMS, LOAD_MORE_SEARCH_ITEMS_ERROR, LOAD_MORE_SEARCH_ITEMS_SUCCESS, SEARCH_ITEMS,
  SEARCH_ITEMS_ERROR,
  SEARCH_ITEMS_SUCCESS,
  SearchAction
} from '../actions/search.actions';
import { pathSatisfies, lt } from 'ramda';

export interface SearchStateItem {
  error: boolean;
  errorData: any;
  pending: boolean;
  success: boolean;
  value?: any;
}

export interface SearchState {
  canLoadMoreItems: SearchStateItem;
  searchItems: SearchStateItem;
  loadMoreSearchItems: SearchStateItem;
}

export const initialState: SearchState = {
  searchItems: <SearchStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: false,
    value: null,
  },
  canLoadMoreItems: <SearchStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: false,
    value: null,
  },
  loadMoreSearchItems: <SearchStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: false,
    value: null,
  },
};

type SearchReducer = Reducer<SearchState, SearchAction>;

const canLoadMoreSuccessReducer: SearchReducer = (state, action) =>
  updateState(state, 'canLoadMoreItems', <SearchStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: pathSatisfies(lt(0), ['payload', 'length'], action),
  });

const searchItemsReducer: SearchReducer = (state, _) => {
  return updateState(state, 'searchItems', <SearchStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: null,
  });
};

const searchItemsSuccessReducer: SearchReducer = (state, action) => {
  const canLoadMoreState = canLoadMoreSuccessReducer(state, action);

  return updateState(canLoadMoreState, 'searchItems', <SearchStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload,
  });
};

const searchItemsErrorReducer: SearchReducer = (state, action) =>
  updateState(state, 'searchItems', <SearchStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: state.searchItems.value,
  });

const loadMoreSearchItemsReducer: SearchReducer = (state, action) => {
  return updateState(state, 'loadMoreSearchItems', <SearchStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload, // Last fetched page
  });
};

const loadMoreSearchItemsSuccessReducer: SearchReducer = (state, action) => {
  const canLoadMoreState = canLoadMoreSuccessReducer(state, action);

  const updatedSearchItems = updateState(canLoadMoreState, 'searchItems', <SearchStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: state.searchItems.value.concat(action.payload),
  });

  return updateState(updatedSearchItems, 'loadMoreSearchItems', <SearchStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: state.loadMoreSearchItems.value, // Last fetched page
  });
};

const loadMoreSearchItemsErrorReducer: SearchReducer = (state, action) =>
  updateState(state, 'loadMoreSearchItems', <SearchStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: state.searchItems.value,
  });

const clearSearchResultsReducer: SearchReducer = (state, _) => {
  const loadMoreReseted = updateState(state, 'loadMoreSearchItems', <SearchStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: null,
  });

  return updateState(loadMoreReseted, 'searchItems', <SearchStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: null,
  });
};

const defaultReducer: SearchReducer = (state, _) => state;

const selectReducer = (actionType: string): SearchReducer => {
  const actionToReducerMap = {
    [CLEAR_SEARCH_RESULTS]: clearSearchResultsReducer,
    [LOAD_MORE_SEARCH_ITEMS]: loadMoreSearchItemsReducer,
    [LOAD_MORE_SEARCH_ITEMS_SUCCESS]: loadMoreSearchItemsSuccessReducer,
    [LOAD_MORE_SEARCH_ITEMS_ERROR]: loadMoreSearchItemsErrorReducer,
    [SEARCH_ITEMS]: searchItemsReducer,
    [SEARCH_ITEMS_SUCCESS]: searchItemsSuccessReducer,
    [SEARCH_ITEMS_ERROR]: searchItemsErrorReducer,
    [DEFAULT]: defaultReducer,
  };
  return actionToReducerMap[actionType] || actionToReducerMap[DEFAULT];
};

export function searchReducer(state = initialState, action) {
  const reducer: SearchReducer = selectReducer(action.type);
  return reducer(state, action);
}
