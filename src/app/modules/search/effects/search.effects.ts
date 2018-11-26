import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { HttpInterceptor, ServerError } from '../../../providers/http.interceptor';
import {
  LOAD_MORE_SEARCH_ITEMS, loadMoreSearchItemsSuccess,
  SEARCH_ITEMS, SearchAction, searchItemsError, searchItemsSuccess, SearchItemsSuccess,
} from '../actions/search.actions';
import { Observable } from 'rxjs/Observable';
import { SearchParams, SearchResult } from '../../../models/search/search.model';

@Injectable()
export class SearchEffects {

  @Effect() public searchItems$ = this.actions$
    .ofType(SEARCH_ITEMS)
    .map(toPayload)
    .switchMap(this.searchItems.bind(this));

  @Effect() public loadMoreItems$ = this.actions$
    .ofType(LOAD_MORE_SEARCH_ITEMS)
    .map(toPayload)
    .switchMap(this.loadMoreItems.bind(this));

  constructor(private actions$: Actions, private http: HttpInterceptor) {}

  private searchItems(params: SearchParams): Observable<SearchAction> {
    return this.http.get<SearchResult[]>('/search', { params })
      .map<SearchResult[], SearchItemsSuccess>(searchItemsSuccess)
      .catch((error: ServerError) => Observable.of(searchItemsError(error)));
  }

  private loadMoreItems(params: SearchParams): Observable<SearchAction> {
    return this.http.get<SearchResult[]>('/search', { params })
      .map<SearchResult[], SearchItemsSuccess>(loadMoreSearchItemsSuccess)
      .catch((error: ServerError) => Observable.of(searchItemsError(error)));
  }
}
