import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, OnInit } from '@angular/core';
import { InfiniteScroll, ModalController, Refresher, Modal, ViewController, Content } from 'ionic-angular';
import { Observable, Subject, BehaviorSubject, Subscription } from 'rxjs/';
import { Store } from '@ngrx/store';
import { isEmpty, inc, last } from 'ramda';
import { AppState } from '../../../app.reducer';
import { Activity, fetchActivities, loadMoreActivities, ParamsModel } from '../actions/activity.actions';
import { TaskParams, OriginPage } from './../../tasks/actions/task.actions';
import { TaskPage } from './../../tasks/pages/task.page';
import { completeRefresherOnError } from '../../../helpers/complete-refresher-on-error';
import { isDefined } from './../../../helpers/path-is-defined';

const initialPage: ParamsModel = { page: 1 };

@Component({
  selector: 'page-activity',
  templateUrl: 'activity.page.html',
  styles: [ 'activity.page.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityPage implements OnInit {

  public activities: Activity[] = [];

  @ViewChild(Content) private content: Content;
  private currentPage: number;
  private pageWasRefreshed = false;
  private canLoadMoreData = true;
  private activities$: Observable<Activity[]>;
  private killer$: Subject<null> = new Subject();
  private refresher$: BehaviorSubject<Refresher> = new BehaviorSubject(null);
  private infiniteScroll$: BehaviorSubject<InfiniteScroll> = new BehaviorSubject(null);
  private activityRefresher: Refresher;
  private activityInfiniteScroll: InfiniteScroll;
  private activitiesSubs: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private store: Store<AppState>,
    private detector: ChangeDetectorRef,
    private viewCtrl: ViewController
  ) {}

  public ngOnInit(): void {
    this.viewCtrl.willEnter.subscribe(this.watchViewWillEnter.bind(this));
    this.viewCtrl.willLeave.subscribe(this.watchViewWillLeave.bind(this));
  }

  public watchViewWillEnter(): void {
    this.content.resize();
    if (isDefined(this.activitiesSubs)) {
      return;
    }
    this.getActivities();
    this.getCurrentPage();
    this.ifErrorCompleteSpinners();
    this.watchRefresher();
    this.watchInfiniteScroll();
    this.watchIfCanLoadMore();
  }

  public watchViewWillLeave(): void {
    this.killer$.next();
    this.activitiesSubs = undefined;

    if (isDefined(this.activityRefresher)) {
      this.activityRefresher.complete();
      this.refresher$.next(null);
    }

    if (isDefined(this.activityInfiniteScroll)) {
      this.activityInfiniteScroll.complete();
      this.infiniteScroll$.next(null);
    }
  }

  public refreshActivities(refresher: Refresher): void {
    this.pageWasRefreshed = true;
    this.store.dispatch(fetchActivities());
    this.store.dispatch(loadMoreActivities(initialPage));
    this.refresher$.next(refresher);
  }

  public loadMoreActivities(infiniteScroll: InfiniteScroll): void {
    if (this.canLoadMoreData) {
      this.currentPage = inc(this.currentPage);
      this.store.dispatch(loadMoreActivities({ page: this.currentPage }));
      this.infiniteScroll$.next(infiniteScroll);
    } else {
      infiniteScroll.complete();
    }
  }

  public trackByFn(index, item): number {
    return item.id;
  }

  public openTask(taskId: number, projectId: number, stageId: number): void {
    const origin: OriginPage = 'ActivityPage';
    const taskParams: TaskParams = { taskId, projectId, stageId, origin };
    const modal: Modal = this.modalCtrl.create(TaskPage, { taskParams });
    modal.present();
  }

  private watchRefresher(): void {
    this.activities$
      .filter<Activity[]>(isDefined)
      .withLatestFrom(this.refresher$)
      .map<any[], Refresher>(last)
      .takeUntil(this.killer$)
      .subscribe(this.completeRefresher.bind(this));
  }

  private watchInfiniteScroll(): void {
    this.activities$
      .filter<Activity[]>(isDefined)
      .withLatestFrom(this.infiniteScroll$)
      .map<any[], InfiniteScroll>(last)
      .takeUntil(this.killer$)
      .subscribe(this.completeInfiniteScroll.bind(this));
  }

  private completeRefresher(refresher: Refresher): void {
    this.activityRefresher = refresher;
    if (isDefined(refresher) && this.pageWasRefreshed) {
      refresher.complete();
      this.pageWasRefreshed = false;
      this.canLoadMoreData = true;
    }
    this.detector.markForCheck();
  }

  private completeInfiniteScroll(infiniteScroll: InfiniteScroll): void {
    this.activityInfiniteScroll = infiniteScroll;
    if (isDefined(infiniteScroll)) {
      infiniteScroll.complete();
    }
    this.detector.markForCheck();
  }

  private getCurrentPage(): void {
    this.store.select<ParamsModel>('activity', 'loadMoreActivities', 'value')
      .filter(isDefined)
      .takeUntil(this.killer$)
      .startWith(initialPage)
      .subscribe(({ page }) => {
        this.currentPage = page;
        this.detector.markForCheck();
      });
  }

  private getActivities(): void {
    this.activities$ = this.store.select<Activity[]>('activity', 'fetchActivities', 'value');

    this.activitiesSubs = this.activities$
      .takeUntil(this.killer$)
      .subscribe(activities => {
        if (isDefined(activities)) {
          this.activities = activities;
        } else {
          this.store.dispatch(fetchActivities());
        }
        this.detector.markForCheck();
      });
  }

  private watchIfCanLoadMore(): void {
    this.store.select<boolean>('activity', 'canLoadMoreActivities', 'value')
      .takeUntil(this.killer$)
      .filter(isDefined)
      .subscribe((canLoadMore) => {
        this.canLoadMoreData = canLoadMore;
        this.detector.markForCheck();
      });
  }

  private ifErrorCompleteSpinners(): void {
    this.store.select<boolean>('activity', 'fetchActivities', 'error')
      .let(completeRefresherOnError(this.killer$, this.refresher$))
      .subscribe(() => this.detector.markForCheck());

    this.store.select<boolean>('activity', 'loadMoreActivities', 'error')
      .let(completeRefresherOnError(this.killer$, this.infiniteScroll$))
      .subscribe(() => this.detector.markForCheck());
  }

}
