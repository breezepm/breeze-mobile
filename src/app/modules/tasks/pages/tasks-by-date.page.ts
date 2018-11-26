import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { TasksPopoverPage } from './tasks-popover.page';
import { Modal, ModalController, PopoverController, Refresher } from 'ionic-angular';
import { Observable, BehaviorSubject, Subject } from 'rxjs/';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import {
  DashboardCard, DashboardLayout,
  fetchDashboardCardsByDueDate, fetchDashboardUsers,
  loadMoreTasksPerDueDate, LoadMoreTasksPerDueDateModel,
  OriginPage, PopoverState, TaskParams,
} from '../actions/task.actions';
import { TaskPage } from './task.page';
import { Task } from '../../../models/tasks/task.model';
import { isEmpty } from 'ramda';
import { sortByNameUpToTen } from '../../../helpers/sort-by-name-up-to-ten';
import { completeRefresherOnError } from '../../../helpers/complete-refresher-on-error';

interface CombinedRefresherData {
  dashboardCards: DashboardCard[];
  refresher?: Refresher;
}

@Component({
  selector: 'page-tasks-by-date',
  templateUrl: 'tasks-by-date.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksByDatePage implements OnInit {
  public dashboardCards: DashboardCard[] = [];
  public selectedUserId: number;
  public isDashboardCardsEmpty = false;
  public loadingTasks = false;
  public isFetchTasksPending = false;

  private isFetchUsersPending = true;
  private dashboardCards$: Observable<DashboardCard[]>;
  private killer$: Subject<null> = new Subject();
  private mainSpinnerStop$: Subject<null> = new Subject();
  private refresher$: BehaviorSubject<Refresher> = new BehaviorSubject(null);
  private taskRefresher: Refresher;

  constructor(
    private store: Store<AppState>,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private detector: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.selectFromStore<PopoverState>('task', 'savePopoverState', 'value')
      .takeUntil(this.killer$)
      .subscribe((popover: PopoverState) => {
        this.selectedUserId = popover.userId;
        this.detector.markForCheck();
      });

    this.selectFromStore<boolean>('task', 'fetchDashboardUsers', 'pending')
      .takeUntil(this.killer$)
      .subscribe((res: boolean) => {
        this.isFetchUsersPending = res;
        this.detector.markForCheck();
      });

    this.selectFromStore<boolean>('task', 'fetchDashboardCardsByDueDate', 'pending')
      .takeUntil(this.mainSpinnerStop$)
      .subscribe((res: boolean) => {
        this.isFetchTasksPending = res;
        this.detector.markForCheck();
      });

    this.selectFromStore<boolean>('task', 'fetchDashboardCardsByDueDate', 'success')
      .filter(Boolean)
      .takeUntil(this.killer$)
      .subscribe(() => {
        this.mainSpinnerStop$.next();
        this.detector.markForCheck();
      });

    this.store.dispatch(fetchDashboardCardsByDueDate(this.selectedUserId));
  }

  public ionViewWillEnter(): void {
    this.store.dispatch(fetchDashboardUsers());

    this.dashboardCards$ = this.selectFromStore<DashboardCard[]>('task', 'fetchDashboardCards', 'value');

    this.selectFromStore<boolean>('task', 'fetchDashboardCardsByDueDate', 'error')
      .let(completeRefresherOnError(this.killer$, this.refresher$))
      .subscribe(() => this.detector.markForCheck());

    this.combineDashboardCardsWithRefresher()
      .subscribe(this.assignDataAndCompleteRefresher.bind(this));

    this.watchLoadingMoreTasks();
  }

  public ionViewWillLeave(): void {
    this.killer$.next();
    if (this.taskRefresher) {
      this.taskRefresher.complete();
      this.refresher$.next(null);
    }
  }

  public getAssignedUsers(users) {
    return sortByNameUpToTen(users || []);
  }

  public openPopover(ev: Event): void {
    if (!this.isFetchUsersPending) {
      this.popoverCtrl
        .create(TasksPopoverPage)
        .present({ ev });
    }
  }

  public openTask(dashboardLayout: DashboardLayout, stageId: number, task: Task, dueDateBlock?: number) {
    const taskId: number = task.card_id;
    const projectId: number = task.project_id;
    const swimlaneId: number = task.swimlane_id;
    const origin: OriginPage = 'TasksByDatePage';
    const taskParams: TaskParams = { dashboardLayout, taskId, projectId, stageId, origin, dueDateBlock, swimlaneId };
    const modal: Modal = this.modalCtrl.create(TaskPage, { taskParams });
    modal.present();
  }

  public refreshDashboardCards(refresher): void {
    this.store.dispatch(fetchDashboardCardsByDueDate(this.selectedUserId));
    this.store.dispatch(fetchDashboardUsers());
    this.refresher$.next(refresher);
  }

  public loadMoreTasks(payload: LoadMoreTasksPerDueDateModel): void {
    this.store.dispatch(loadMoreTasksPerDueDate(payload));
  }

  private assignDataAndCompleteRefresher(data: CombinedRefresherData): void {
    this.taskRefresher = data.refresher;
    this.dashboardCards = data.dashboardCards;
    this.isDashboardCardsEmpty = isEmpty(this.dashboardCards);
    if (data.refresher) {
      data.refresher.complete();
    }
    this.detector.markForCheck();
  }

  private combineDashboardCardsWithRefresher(): Observable<CombinedRefresherData> {
    return this.dashboardCards$
      .withLatestFrom(this.refresher$)
      .map(([ dashboardCards, refresher ]) => ({ dashboardCards, refresher }))
      .takeUntil(this.killer$);
  }

  private selectFromStore <T>(...path: string[]): Observable<T> {
    return this.store.select<T>(...path)
      .filter(v => v != null);
  }

  private watchLoadingMoreTasks(): void {
    const loadingTasks$ = this.store.select<boolean>('task', 'loadMoreTasksPerDueDate', 'pending');

    loadingTasks$
      .takeUntil(this.killer$)
      .subscribe((isPending) => {
        this.loadingTasks = isPending;
        this.detector.markForCheck();
      });
  }
}
