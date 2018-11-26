import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { InfiniteScroll, Modal, ModalController, PopoverController, Refresher } from 'ionic-angular';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import { Observable, BehaviorSubject, Subject } from 'rxjs/';
import { TasksPopoverPage } from './tasks-popover.page';
import { isEmpty } from 'ramda';

import {
  DashboardCard, DashboardLayout,
  fetchDashboardCardsByProject, fetchDashboardUsers,
  loadMoreDashboardCards, LoadMoreTasks,
  loadMoreTasksPerStage, OriginPage, PopoverState, resetLoadMoreDashboardCards, TaskParams,
} from '../actions/task.actions';
import { Task } from './../../../models/tasks/task.model';
import { TaskPage } from './task.page';
import { completeRefresherOnError } from '../../../helpers/complete-refresher-on-error';

interface CombinedRefresherData {
  dashboardCards: DashboardCard[];
  refresher?: Refresher;
}

interface CombinedInfiniteScrollData {
  dashboardCards: DashboardCard[];
  infiniteScroll?: InfiniteScroll;
}

@Component({
  selector: 'page-tasks-by-projects',
  templateUrl: 'tasks-by-projects.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksByProjectsPage implements OnInit {
  public dashboardCards: DashboardCard[];
  public currentPage = 1;
  public isDashboardCardsEmpty = false;
  public selectedUserId: number;
  public loadingTasks = false;
  public isFetchTasksPending = false;

  private canLoadMoreData: boolean = true;
  private isFetchUsersPending = true;
  private loadMoreDashboardCards$: Observable<DashboardCard[]>;
  private dashboardCards$: Observable<DashboardCard[]>;
  private killer$: Subject<null> = new Subject();
  private mainSpinnerStop$: Subject<null> = new Subject();
  private refresher$: BehaviorSubject<Refresher> = new BehaviorSubject(null);
  private infiniteScroll$: BehaviorSubject<InfiniteScroll> = new BehaviorSubject(null);
  private taskRefresher: Refresher;
  private tasksInfiniteScroll: InfiniteScroll;

  constructor(
    private store: Store<AppState>,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private detector: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.store.dispatch(resetLoadMoreDashboardCards());
    this.selectFromStore<PopoverState>('task', 'savePopoverState', 'value')
      .takeUntil(this.killer$)
      .subscribe((popover: PopoverState) => {
        this.canLoadMoreData = true;
        this.currentPage = 1;
        this.selectedUserId = popover.userId;
        this.detector.markForCheck();
      });

    this.selectFromStore<boolean>('task', 'fetchDashboardUsers', 'pending')
      .takeUntil(this.killer$)
      .subscribe((res: boolean) => {
        this.isFetchUsersPending = res;
        this.detector.markForCheck();
      });

    this.selectFromStore<boolean>('task', 'fetchDashboardCardsByProject', 'pending')
      .takeUntil(this.mainSpinnerStop$)
      .subscribe((res: boolean) => {
        this.isFetchTasksPending = res;
        this.detector.markForCheck();
      });

    this.selectFromStore<boolean>('task', 'fetchDashboardCardsByProject', 'success')
      .filter(Boolean)
      .takeUntil(this.killer$)
      .subscribe(() => {
        this.mainSpinnerStop$.next();
        this.detector.markForCheck();
      });

    this.store.dispatch(fetchDashboardCardsByProject(this.selectedUserId));
  }

  public ionViewWillEnter(): void {
    this.store.dispatch(fetchDashboardUsers());

    this.dashboardCards$ = this.selectFromStore<DashboardCard[]>('task', 'fetchDashboardCards', 'value');

    this.selectFromStore<boolean>('task', 'fetchDashboardCardsByProject', 'error')
      .let(completeRefresherOnError(this.killer$, this.refresher$))
      .subscribe(() => this.detector.markForCheck());

    this.combineDashboardCardsWithRefresher()
      .subscribe(this.assignDataAndCompleteRefresher.bind(this));

    this.combineDashboardCardsWithInfiniteScroll()
      .subscribe(this.completeInfiniteScroll.bind(this));

    this.watchLoadingMoreTasks();
  }

  public ionViewWillLeave(): void {
    this.killer$.next();
    if (this.taskRefresher) {
      this.taskRefresher.complete();
      this.refresher$.next(null);
    }
    if (this.tasksInfiniteScroll) {
      this.tasksInfiniteScroll.complete();
      this.infiniteScroll$.next(null);
    }
  }

  public trackById(_, item) {
    if (item != null) {
      return item.id;
    }
  }

  public openPopover(ev: Event): void {
    if (!this.isFetchUsersPending) {
      this.popoverCtrl
        .create(TasksPopoverPage)
        .present({ ev });
    }
  }

  public loadMoreStageTasks(payload: LoadMoreTasks): void {
    this.store.dispatch(loadMoreTasksPerStage(payload));
  }

  public refreshDashboardCards(refresher): void {
    this.store.dispatch(fetchDashboardCardsByProject(this.selectedUserId));
    this.store.dispatch(fetchDashboardUsers());
    this.refresher$.next(refresher);
  }

  public loadMoreDashboardCards(infiniteScroll): void {
    if (this.canLoadMoreData) {
      this.store.dispatch(loadMoreDashboardCards({ page: this.currentPage += 1, userId: this.selectedUserId }));
      this.infiniteScroll$.next(infiniteScroll);
    } else {
      infiniteScroll.complete();
    }
  }

  public openTask(dashboardLayout: DashboardLayout, stageId: number, task: Task, dueDateBlock?: number) {
    const taskId: number = task.id;
    const projectId: number = task.project_id;
    const swimlaneId: number = task.swimlane_id;
    const origin: OriginPage = 'TasksByProjectsPage';
    const taskParams: TaskParams = { dashboardLayout, taskId, projectId, stageId, origin, dueDateBlock, swimlaneId };
    const modal: Modal = this.modalCtrl.create(TaskPage, { taskParams });
    modal.present();
  }

  private assignDataAndCompleteRefresher(data: CombinedRefresherData): void {
    this.taskRefresher = data.refresher;
    this.dashboardCards = data.dashboardCards;
    this.isDashboardCardsEmpty = isEmpty(this.dashboardCards);
    if (data.refresher) {
      data.refresher.complete();
      this.canLoadMoreData = true;
      this.currentPage = 1;
    }
    this.detector.markForCheck();
  }

  private completeInfiniteScroll(data: CombinedInfiniteScrollData): void {
    this.tasksInfiniteScroll = data.infiniteScroll;
    if (data.infiniteScroll) {
      data.infiniteScroll.complete();
    }
    this.detector.markForCheck();
  }

  private combineDashboardCardsWithRefresher(): Observable<CombinedRefresherData> {
    return this.dashboardCards$
      .withLatestFrom(this.refresher$)
      .map(([ dashboardCards, refresher ]) => ({ dashboardCards, refresher }))
      .takeUntil(this.killer$);
  }

  private combineDashboardCardsWithInfiniteScroll(): Observable<CombinedInfiniteScrollData> {
    this.loadMoreDashboardCards$ = this.selectFromStore<DashboardCard[]>('task', 'loadMoreDashboardCards', 'value');

    return this.loadMoreDashboardCards$
      .withLatestFrom(this.infiniteScroll$)
      .map(([ dashboardCards, infiniteScroll ]) => ({ dashboardCards, infiniteScroll }))
      .do((data: CombinedInfiniteScrollData) => {
        if (isEmpty(data.dashboardCards)) {
          this.canLoadMoreData = false;
        }
      })
      .takeUntil(this.killer$);
  }

  private selectFromStore <T>(...path: string[]): Observable<T> {
    return this.store.select<T>(...path)
      .filter(v => v != null);
  }

  private watchLoadingMoreTasks(): void {
    const loadingTasks$ = this.store
      .select<boolean>('task', 'loadMoreTasksPerStage', 'pending');

    loadingTasks$
      .takeUntil(this.killer$)
      .subscribe((isPending) => {
        this.loadingTasks = isPending;
        this.detector.markForCheck();
      });
  }
}
