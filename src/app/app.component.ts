import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';

import { TabsPage } from './modules/tabs/tabs.page';
import { BrSignInPage } from './modules/user/pages/login.page';
import { AppState } from './app.reducer';
import { startUp } from './shared/app-run/actions/app-run.actions';
import { AppRunState } from './shared/app-run/reducers/app-run.reducer';

@Component({
  templateUrl: 'app.html',
  selector: 'breeze-app',
})
export class BreezeApp implements OnInit {

  public rootPage$ = this.store.select('appRun')
    .map((run: AppRunState) => run.rootPage === 'TabsPage' ? TabsPage : BrSignInPage);

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private keyboard: Keyboard,
    private store: Store<AppState>
  ) {}

  public ngOnInit() {
    this.platform.ready().then(this.onPlatformReady.bind(this));
    this.store.dispatch(startUp());
  }

  private onPlatformReady(): void {
    this.splashScreen.hide();
    this.keyboard.hideKeyboardAccessoryBar(true);
    this.keyboard.disableScroll(false);
  }
}
