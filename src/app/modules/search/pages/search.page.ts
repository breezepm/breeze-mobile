import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { InfiniteScroll, Modal, ModalController, NavController, Searchbar, ViewController } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { isEmpty, last } from 'ramda';

import { clearSearchResults, loadMoreSearchItems, searchItems } from '../actions/search.actions';
import { SearchParams, SearchResult } from '../../../models/search/search.model';
import { AppState } from '../../../app.reducer';
import { isDefined } from '../../../helpers/path-is-defined';
import { OriginPage } from '../../tasks/actions/task.actions';
import { TaskPage } from '../../tasks/pages/task.page';
import { Keyboard } from '@ionic-native/keyboard';

@Component({
  selector: 'page-search',
  templateUrl: 'search.page.html',
  styles: [ 'search.page.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPage {
  public searchResults: SearchResult[];
  public isSearchPending: boolean;
  public searchString: string;
  public isSearchResultEmpty$: Observable<boolean>;

  @ViewChild(Searchbar) private searchBarRef: Searchbar;

  private searchResults$: Observable<SearchResult[]>;
  private canLoadMoreData = true;
  private currentPage = 1;
  private infiniteScroll$: BehaviorSubject<InfiniteScroll> = new BehaviorSubject(null);
  private killer$: Subject<null> = new Subject();
  private searchResultsInfiniteScroll: InfiniteScroll;

  private searchPayload: SearchParams = {
    query: '',
    project: false,
    card: true,
    comment: true,
    todo: true,
    file: true,
    tag: true,
    page: 1,
  };

  constructor(private viewCtrl: ViewController, private store: Store<AppState>, private modalCtrl: ModalController,
              private detector: ChangeDetectorRef, private keyboard: Keyboard, private navCtrl: NavController
  ) {}

  public dismiss() {
    this.viewCtrl.dismiss();
  }

  public ngOnInit(): void {
    this.checkIfSearchItemsAreBeingFetched();
    this.fetchSearchResultsFromStore();
  }

  public ionViewWillEnter() {
    this.watchInfiniteScroll();
    this.watchIfCanLoadMore();
  }

  public ionViewDidEnter() {
    // Hack which allows to check whether user is redirected back from TaskPage or not
    if (!(this.navCtrl.last().instance.constructor.name === 'TaskPage')) {
      setTimeout(() => this.searchBarRef.setFocus());
    }
  }

  public ngOnDestroy() {
    this.currentPage = 1;
    this.store.dispatch(clearSearchResults());
    this.killer$.next();
  }

  public checkIfSearchItemsAreBeingFetched() {
    this.selectFromStore<boolean>('search', 'searchItems', 'pending')
      .takeUntil(this.killer$)
      .subscribe((res: boolean) => {
        this.isSearchPending = res;
        this.detector.markForCheck();
      });
  }

  public fetchSearchResultsFromStore() {
    this.searchResults$ = this.selectFromStore('search', 'searchItems', 'value');

    this.isSearchResultEmpty$ = this.searchResults$
      .filter(isDefined)
      .map<SearchResult[], boolean>(isEmpty)
      .takeUntil(this.killer$);

    this.searchResults$
      .takeUntil(this.killer$)
      .subscribe((searchResults: SearchResult[]) => {
        this.searchResults = searchResults;
        this.detector.markForCheck();
      });
  }

  public onClear() {
    this.currentPage = 1;
  }

  public openTask(taskId: number, projectId: number): void {
    const origin: OriginPage = 'SearchPage';
    const taskParams = { taskId, projectId, origin };
    const modal: Modal = this.modalCtrl.create(TaskPage, { taskParams });
    modal.present();
  }

  public search() {
    this.searchPayload.query = this.searchString;
    this.keyboard.close();
    this.store.dispatch(searchItems(this.searchPayload));
  }

  public loadMoreSearchResults(infiniteScroll): void {
    this.currentPage += 1;
    this.searchPayload.page = this.currentPage;

    if (this.canLoadMoreData) {
      this.store.dispatch(loadMoreSearchItems(this.searchPayload));
      this.infiniteScroll$.next(infiniteScroll);
    } else {
      infiniteScroll.complete();
    }
  }

  private watchInfiniteScroll(): void {
    this.searchResults$
      .filter<SearchResult[]>(isDefined)
      .withLatestFrom(this.infiniteScroll$)
      .map<any[], InfiniteScroll>(last)
      .takeUntil(this.killer$)
      .subscribe((infiniteScroll: InfiniteScroll) => {
        this.completeInfiniteScroll(infiniteScroll);
        this.detector.markForCheck();
      });
  }

  private completeInfiniteScroll(infiniteScroll: InfiniteScroll): void {
    this.searchResultsInfiniteScroll = infiniteScroll;
    if (isDefined(infiniteScroll)) {
      infiniteScroll.complete();
    }
  }

  private watchIfCanLoadMore(): void {
    this.store.select<boolean>('search', 'canLoadMoreItems', 'value')
      .takeUntil(this.killer$)
      .filter(isDefined)
      .subscribe((canLoadMore) => {
        this.canLoadMoreData = canLoadMore;
        this.detector.markForCheck();
      });
  }

  private selectFromStore <T>(...route: string[]): Observable<T> {
    return this.store.select<T>(...route)
      .filter(v => v != null);
  }
}
