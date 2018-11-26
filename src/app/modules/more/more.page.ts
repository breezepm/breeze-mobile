import { LoadingController, ModalController, NavController } from 'ionic-angular';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';

import { AppState } from './../../app.reducer';
import { UserState } from './../user/reducers/user.reducer';
import { logout, setUserTeamSuccess, fetchCurrentUser } from './../user/actions/user.actions';
import { User, Team } from './../../models/user/user-credentials.model';
import { Observable } from 'rxjs/Observable';
import { SearchPage } from '../search/pages/search.page';

@Component({
  selector: 'page-more',
  templateUrl: 'more.page.html',
  styles: [ 'more.page.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MorePage {
  public user: User;
  public teams: Team[] = [];
  public showTeamsList: boolean;
  public selectedTeamId: number;

  private killer$: Subject<any> = new Subject();

  constructor(
    private store: Store<AppState>,
    private navCtrl: NavController,
    private detector: ChangeDetectorRef,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
  ) {}

  public logout() {
    this.store.dispatch(logout());
  }

  public ionViewWillEnter() {
    this.store.select<UserState>('user')
      .filter(userState => userState.fetchCurrentUser.value && userState.setUserTeam.value)
      .takeUntil(this.killer$)
      .subscribe(userState => {
        const currentUser = userState.fetchCurrentUser.value;
        const color = '#' + currentUser.color;

        this.selectedTeamId = userState.setUserTeam.value;
        this.setUserAndTeams({ ...currentUser, color });
        this.detector.markForCheck();
      });
  }

  public ionViewWillLeave() {
    this.killer$.next();
  }

  public openSearchModal() {
    this.modalCtrl.create(SearchPage).present();
  }

  public selectTeam(teamId: number): void {
    if (this.selectedTeamId !== teamId) {
      this.loadingCtrl.create({
        content: 'Switching teams. This may take a while.',
        duration: 5000,
      })
      .present({ animate: false });

      this.store.dispatch(setUserTeamSuccess(teamId));
      this.selectedTeamId = teamId;
      this.navCtrl.parent.select(0);
    }
  }

  private setUserAndTeams(user: User): void {
    this.teams = user.teams;
    this.user = user;
    this.showTeamsList = user.teams.length > 0;
  }
}
