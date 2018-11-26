import { ViewController, NavController, Nav } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import { ActivityPage } from './activity.page';
import { NotificationsPage } from './notifications.page';
import { isDefined } from './../../../helpers/path-is-defined';

@Component({
  templateUrl: 'activity-menu.page.html',
  selector: 'activity-menu',
})
export class ActivityMenuPage implements OnInit {

  public root: any;

  public subpage = 'notifications';

  public notificationsNumber$ = this.store
    .select<number>('notification', 'notificationsNumber', 'value')
    .filter(isDefined);

  public showBadge$ = this.notificationsNumber$.map(num => num > 0);

  private pages = { ActivityPage, NotificationsPage };

  constructor(private store: Store<AppState>, private navCtrl: NavController) {}

  public ngOnInit(): void {
    this.setRootPage('NotificationsPage');
  }

  public ionViewWillEnter(): void {
    this.navCtrl.getActiveChildNavs().forEach((nav: Nav) => {
      const childTabViewCtrl: ViewController = nav.first();
      childTabViewCtrl.willEnter.next();
    });
  }

  public ionViewWillLeave(): void {
    this.navCtrl.getActiveChildNavs().forEach((nav: Nav) => {
      const childTabViewCtrl: ViewController = nav.first();
      childTabViewCtrl.willLeave.next();
    });
  }

  public setRootPage(pageName: string): void {
    this.root = this.pages[pageName];
  }

}
