import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { InfiniteScroll, ModalController, Refresher, ViewController, ItemSliding } from 'ionic-angular';
import { Store } from '@ngrx/store';
import { Observable, Subject, BehaviorSubject, Subscription } from 'rxjs/';
import { isEmpty, inc, last } from 'ramda';

import { AppState } from '../../../app.reducer';
import {
  NotificationItem, fetchNotifications, loadMoreNotifications, fetchNotificationsNumber,
  decrementNotificationsNumber, incrementNotificationsNumber, changeNotificationStatus,
  ParamsModel,
} from '../actions/notifications.actions';
import { TaskParams, OriginPage } from './../../tasks/actions/task.actions';
import { TaskPage } from './../../tasks/pages/task.page';
import { completeRefresherOnError } from '../../../helpers/complete-refresher-on-error';
import { isDefined } from './../../../helpers/path-is-defined';

const initialPage: ParamsModel = { page: 1 };

@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.page.html',
  styles: [ 'notifications.page.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsPage implements OnInit {

  public notifications: NotificationItem[] = [];
  public isNotificationsEmpty$: Observable<boolean>;

  private currentPage: number;
  private pageWasRefreshed = false;
  private canLoadMoreData = true;
  private notifications$: Observable<NotificationItem[]>;
  private killer$: Subject<null> = new Subject();
  private refresher$: BehaviorSubject<Refresher> = new BehaviorSubject(null);
  private infiniteScroll$: BehaviorSubject<InfiniteScroll> = new BehaviorSubject(null);
  private notificationsRefresher: Refresher;
  private notificationsInfiniteScroll: InfiniteScroll;
  private notificationSubs: Subscription;

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
    if (isDefined(this.notificationSubs)) {
      return;
    }

    this.getNotifications();
    this.getCurrentPage();
    this.ifErrorCompleteSpinners();
    this.watchRefresher();
    this.watchInfiniteScroll();
    this.watchIfCanLoadMore();
  }

  public watchViewWillLeave(): void {
    this.killer$.next();
    this.notificationSubs = undefined;

    if (this.notificationsRefresher) {
      this.notificationsRefresher.complete();
      this.refresher$.next(null);
    }

    if (this.notificationsInfiniteScroll) {
      this.notificationsInfiniteScroll.complete();
      this.infiniteScroll$.next(null);
    }
  }

  public refreshNotifications(refresher: Refresher): void {
    this.pageWasRefreshed = true;
    this.fetchNotificationsFromAPI();
    this.store.dispatch(loadMoreNotifications(initialPage));
    this.refresher$.next(refresher);
  }

  public loadMoreNotifications(infiniteScroll: InfiniteScroll): void {
    if (this.canLoadMoreData) {
      this.currentPage = inc(this.currentPage);
      this.store.dispatch(loadMoreNotifications({ page: this.currentPage }));
      this.infiniteScroll$.next(infiniteScroll);
    } else {
      infiniteScroll.complete();
    }
  }

  public trackByFn(index, item): number {
    return item.id;
  }

  public openTask(taskId: number, projectId: number, notificationId: number, slidingItem, isMarked: boolean): void {
    const origin: OriginPage = 'ActivityPage';
    const stageId = 1;
    const taskParams: TaskParams = { taskId, projectId, stageId, origin };
    this.modalCtrl.create(TaskPage, { taskParams }).present();

    if (!isMarked) {
      isMarked = true;
      this.changeNotificationStatus(notificationId, isMarked, slidingItem);
    }
  }

  public changeNotificationStatus(notificationId: number, isMarked: boolean, slidingItem: ItemSliding): void {
    this.store.dispatch(changeNotificationStatus({ notificationId, isMarked }));
    this.store.dispatch(isMarked ? decrementNotificationsNumber() : incrementNotificationsNumber());
    slidingItem.close();
  }

  private watchRefresher(): void {
    this.notifications$
      .filter(isDefined)
      .withLatestFrom(this.refresher$)
      .map<any[], Refresher>(last)
      .takeUntil(this.killer$)
      .subscribe(this.completeRefresher.bind(this));
  }

  private watchInfiniteScroll(): void {
    this.notifications$
      .filter(isDefined)
      .withLatestFrom(this.infiniteScroll$)
      .map<any[], InfiniteScroll>(last)
      .takeUntil(this.killer$)
      .subscribe(this.completeInfiniteScroll.bind(this));
  }

  private completeRefresher(refresher: Refresher): void {
    this.notificationsRefresher = refresher;
    if (isDefined(refresher) && this.pageWasRefreshed) {
      refresher.complete();
      this.pageWasRefreshed = false;
      this.canLoadMoreData = true;
    }
    this.detector.markForCheck();
  }

  private completeInfiniteScroll(infiniteScroll: InfiniteScroll): void {
    this.notificationsInfiniteScroll = infiniteScroll;
    if (isDefined(infiniteScroll)) {
      infiniteScroll.complete();
    }
    this.detector.markForCheck();
  }

  private fetchNotificationsFromAPI(): void {
    this.store.dispatch(fetchNotifications());
    this.store.dispatch(fetchNotificationsNumber());
  }

  private getCurrentPage(): void {
    this.store.select<ParamsModel>('notification', 'loadMoreNotifications', 'value')
      .filter(isDefined)
      .takeUntil(this.killer$)
      .startWith(initialPage)
      .subscribe(({ page }) => {
        this.currentPage = page;
        this.detector.markForCheck();
      });
  }

  private getNotifications(): void {
    this.notifications$ = this.store.select<NotificationItem[]>('notification', 'fetchNotifications', 'value');

    this.isNotificationsEmpty$ = this.notifications$
      .filter(isDefined)
      .map<NotificationItem[], boolean>(isEmpty)
      .takeUntil(this.killer$);

    this.notificationSubs = this.notifications$
      .takeUntil(this.killer$)
      .subscribe((notifications) => {
        if (isDefined(notifications)) {
          this.notifications = notifications;
        } else {
          this.fetchNotificationsFromAPI();
        }
        this.detector.markForCheck();
      });
  }

  private watchIfCanLoadMore(): void {
    this.store.select<boolean>('notification', 'canLoadMoreNotifications', 'value')
      .takeUntil(this.killer$)
      .filter(isDefined)
      .subscribe((canLoadMore) => {
        this.canLoadMoreData = canLoadMore;
        this.detector.markForCheck();
      });
  }

  private ifErrorCompleteSpinners(): void {
    this.store.select<boolean>('notification', 'fetchNotifications', 'error')
      .let(completeRefresherOnError(this.killer$, this.refresher$))
      .subscribe(() => this.detector.markForCheck());

    this.store.select<boolean>('notification', 'loadMoreNotifications', 'error')
      .let(completeRefresherOnError(this.killer$, this.infiniteScroll$))
      .subscribe(() => this.detector.markForCheck());
  }

}
