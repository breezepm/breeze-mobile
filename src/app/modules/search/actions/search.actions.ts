import { actionsDispatcher, type } from '../../../actions-utils';
import { Action } from '@ngrx/store';
import { ServerError } from '../../../providers/http.interceptor';
import { SearchParams, SearchResult } from '../../../models/search/search.model';

export const DEFAULT = type('[Search] No action match');

export const SEARCH_ITEMS = type('[Search] Search Items');
export const SEARCH_ITEMS_SUCCESS = type('[Search] Search Items Success');
export const SEARCH_ITEMS_ERROR = type('[Search] Search Items Error');

export const LOAD_MORE_SEARCH_ITEMS = type('[Search] Load More Search Items');
export const LOAD_MORE_SEARCH_ITEMS_SUCCESS = type('[Search] Load More Search Items Success');
export const LOAD_MORE_SEARCH_ITEMS_ERROR = type('[Search] Load More Search Items Error');

export const CLEAR_SEARCH_RESULTS = type('[Search] Clear Search Results');

export interface SearchItems extends Action {
  payload: SearchParams;
}

export interface SearchItemsSuccess extends Action {
  payload: SearchResult[];
}

export interface SearchItemsError extends Action {
  payload: ServerError;
}

interface ClearSearchResultsSuccess extends Action {
  payload: any;
}

export type SearchAction =
  SearchItems
  | SearchItemsSuccess
  | SearchItemsError;

export const searchItems =
  actionsDispatcher<SearchParams, SearchItems>(SEARCH_ITEMS);
export const searchItemsSuccess =
  actionsDispatcher<SearchResult[], SearchItemsSuccess>(SEARCH_ITEMS_SUCCESS);
export const searchItemsError =
  actionsDispatcher<ServerError, SearchItemsError>(SEARCH_ITEMS_ERROR);

export const loadMoreSearchItems =
  actionsDispatcher<SearchParams, SearchItems>(LOAD_MORE_SEARCH_ITEMS);
export const loadMoreSearchItemsSuccess =
  actionsDispatcher<SearchResult[], SearchItemsSuccess>(LOAD_MORE_SEARCH_ITEMS_SUCCESS);
export const loadMoreSearchItemsError =
  actionsDispatcher<ServerError, SearchItemsError>(LOAD_MORE_SEARCH_ITEMS_ERROR);

export const clearSearchResults =
  actionsDispatcher<any, ClearSearchResultsSuccess>(CLEAR_SEARCH_RESULTS);
