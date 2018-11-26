import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActionSheetController, ModalController, NavController, Platform, Refresher } from 'ionic-angular';
import { Action, Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject } from 'rxjs/';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/withLatestFrom';

import { archiveProject, deleteProject, fetchProjects } from './../actions/project.actions';
import { Board } from './../../../models/projects/board.model';
import { AppState } from './../../../app.reducer';
import { fetchTeamUsers } from '../../user/actions/user.actions';
import { AddNewProjectPage } from './add-new-project.page';
import { ProjectPage } from './project.page';
import { completeRefresherOnError } from '../../../helpers/complete-refresher-on-error';

interface CombinedData {
  boards: Board[];
  isUserObserver: boolean;
  refresher?: Refresher;
}

interface ActionSheetConfig {
  title: string;
  destructiveButton: { text: string, icon: string };
}

@Component({
  selector: 'page-projects',
  templateUrl: 'projects.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsPage implements OnInit {
  public boards: Board[];
  public isUserObserver: boolean = true;

  private isIOS: boolean;
  private board$: Observable<Board[]>;
  private isUserObserver$: Observable<boolean>;
  private refresher$: BehaviorSubject<Refresher> = new BehaviorSubject(null);
  private killer$: Subject<null> = new Subject();
  private projectsRefresher: Refresher;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private platform: Platform,
    private navCtrl: NavController,
    private store: Store<AppState>,
    private modalCtrl: ModalController,
    private detector: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.isIOS = this.platform.is('ios');
    this.fetchProjects();
  }

  public ionViewWillEnter(): void {
    this.store.dispatch(fetchTeamUsers());

    this.isUserObserver$ = this.selectFromStore<boolean>('user', 'fetchCurrentUser', 'value', 'observer');
    this.board$ = this.selectFromStore<Board[]>('project', 'fetchProjects', 'value');

    this.selectFromStore<boolean>('project', 'fetchProjects', 'error')
      .let(completeRefresherOnError(this.killer$, this.refresher$))
      .subscribe(() => {
        this.detector.markForCheck();
      });

    this.safeCombiner()
      .subscribe(this.assignDataAndCompleteRefresher.bind(this));
  }

  public ionViewWillLeave() {
    this.killer$.next();
    if (this.projectsRefresher) {
      this.projectsRefresher.complete();
      this.refresher$.next(null);
    }
  }

  public refreshProjects(refresher: Refresher): void {
    this.fetchProjects();
    this.refresher$.next(refresher);
  }

  public openModal(): void {
    this.modalCtrl.create(AddNewProjectPage).present();
  }

  public archiveProject(workspaceId: number, projectId: number): void {
    const CONFIG: ActionSheetConfig = {
      title: 'Archive Project',
      destructiveButton: { text: 'Archive', icon: 'archive' },
    };
    this.presentActionSheet(CONFIG, archiveProject({ workspaceId, projectId }));
  }

  public deleteProject(workspaceId: number, projectId: number) {
    const CONFIG: ActionSheetConfig = {
      title: 'Delete Project',
      destructiveButton: { text: 'Delete', icon: 'trash' },
    };
    this.presentActionSheet(CONFIG, deleteProject({ workspaceId, projectId }));
  }

  public openProject(projectId: number): void {
    this.navCtrl.push(ProjectPage, { projectId });
  }

  public showDivider(board: Board): boolean {
    return board.workspace !== 'breeze-main-ionic' && board.projects.length > 0;
  }

  private fetchProjects(): void {
    this.store.dispatch(fetchProjects());
  }

  private selectFromStore <T>(...route: string[]): Observable<T> {
    return this.store.select<T>(...route)
      .filter(v => v != null);
  }

  private safeCombiner(): Observable<CombinedData> {
    return this.board$.withLatestFrom(
      this.isUserObserver$,
      this.refresher$,
      (boards, isUserObserver, refresher) => ({ boards, isUserObserver, refresher })
    )
    .takeUntil(this.killer$);
  }

  private assignDataAndCompleteRefresher(data: CombinedData): void {
    this.projectsRefresher = data.refresher;
    this.isUserObserver = data.isUserObserver;
    this.boards = data.boards;
    if (data.refresher) {
      data.refresher.complete();
    }
    this.detector.markForCheck();
  }

  private presentActionSheet(config: ActionSheetConfig, action: Action): void {
    const CONFIG = {
      title: config.title,
      buttons: [
        {
          text: config.destructiveButton.text,
          role: 'destructive',
          icon: !this.isIOS ? config.destructiveButton.icon : null,
          handler: () => {
            this.store.dispatch(action);
          },
        },
        {
          text: 'Cancel',
          icon: !this.isIOS ? 'close' : null,
          role: 'cancel',
        },
      ],
    };

    this.actionSheetCtrl.create(CONFIG).present();
  }

}
