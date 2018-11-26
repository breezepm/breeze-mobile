import { Component, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Tab, Tabs } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/operator/filter';
import 'rxjs/operator/map';

import { TasksByProjectsPage } from '../tasks/pages/tasks-by-projects.page';
import { TasksByDatePage } from '../tasks/pages/tasks-by-date.page';
import { ProjectsPage } from './../projects/pages/projects.page';
import { MorePage } from './../more/more.page';
import { ActivityMenuPage } from './../activity/pages/activity-menu.page';
import { AppState } from '../../app.reducer';
import { DashboardCard, PopoverState } from '../tasks/actions/task.actions';
import { head, pathEq, pipe, prop } from 'ramda';
import { NotificationsPage } from './../activity/pages/notifications.page';
import { SearchPage } from '../search/pages/search.page';
import { AddNewTaskPage } from '../tasks/pages/add-new-task.page';

interface CombinedData {
  dashboards: DashboardCard[];
  popover: PopoverState;
}

@Component({
  templateUrl: 'tabs.page.html',
  selector: 'page-tabs',
})
export class TabsPage {
  public tab1Root: any;
  public tab2Root: any = ProjectsPage;
  public tab3Root: any = AddNewTaskPage;
  public tab4Root: any = ActivityMenuPage;
  public tab5Root: any = MorePage;
  public notificationsNumber$ = this.store.select('notification', 'notificationsNumber', 'value');

  @ViewChild('appTabs') private tabsRef: Tabs;
  @ViewChild('appTab') private tabRef: Tab;

  constructor(private store: Store<AppState>) {}

  public ionViewDidEnter() {
    const defaultDashboard$ = this.store.select('task', 'fetchDashboardCards', 'value');
    const dashboardByProject$ = this.store.select('task', 'fetchDashboardCardsByProject', 'value');
    const dashboardByDueDate$ = this.store.select('task', 'fetchDashboardCardsByDueDate', 'value');
    const popover$ = this.store.select('task', 'savePopoverState', 'value');

    const dashboards$ = Observable
      .merge(defaultDashboard$, dashboardByProject$, dashboardByDueDate$)
      .filter(v => v != null);

    dashboards$.combineLatest(
        popover$,
        (dashboards: DashboardCard[], popover: PopoverState) => ({ popover, dashboards })
      )
      .map((combinedData: CombinedData) => {
        const getTaskSortingMethod = (data) => {
          if (pathEq(['popover', 'page'], 'TasksByProjectPage', data)) {
            return 'byProjects';
          } else if (pathEq(['popover', 'page'], 'TasksByDatePage', data)) {
            return 'byDate';
          } else {
            return pipe(
              prop('dashboards'),
              head,
              pathEq(['dashboard_layout'], 'project'),
              isProjectPage => isProjectPage ? 'byProjects' : 'byDate'
            )(data);
          }
        };

        const sortMethod = getTaskSortingMethod(combinedData);

        const tasksPage = {
          byProjects: TasksByProjectsPage,
          byDate: TasksByDatePage,
        };

        return tasksPage[sortMethod];
      })
      .distinctUntilChanged()
      .subscribe(this.setTasksRootTab.bind(this));
  }

  private setTasksRootTab(tasksPage) {
    this.tabRef.root = tasksPage;
    this.tabsRef.select(0);
  }

}
