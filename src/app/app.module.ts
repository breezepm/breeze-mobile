import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';
import { MediaCapture } from '@ionic-native/media-capture';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

import { IonicRxStorageModule } from './shared/ionic-rx-storage/ionic-rx-storage.module';
import { apiUrlProvider } from './providers/api-url.value';
import { HttpInterceptor } from './providers/http.interceptor';
import { BreezeApp } from './app.component';
import { ProjectsModule } from './modules/projects/projects.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { ActivityModule } from './modules/activity/activity.module';
import { MoreModule } from './modules/more/more.module';
import { TabsModule } from './modules/tabs/tabs.module';

import { appReducer } from './app.reducer';
import { UserModule } from './modules/user/user.module';
import { AppRunModule } from './shared/app-run/app-run.module';
import { SharedModule } from './shared/shared.module';
import { ConfigurationService } from './providers/configuration.service';
import { SearchModule } from './modules/search/search.module';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@NgModule({
  declarations: [ BreezeApp ],
  imports: [
    ProjectsModule,
    ActivityModule,
    TasksModule,
    TabsModule,
    MoreModule,
    SearchModule,
    AppRunModule,
    UserModule,
    SharedModule,
    BrowserModule,
    HttpModule,
    IonicRxStorageModule,
    IonicModule.forRoot(BreezeApp, {
      platforms: {
        android: {
          tabsPlacement: 'top',
        },
        ios: {
          tabsPlacement: 'bottom',
        },
      },
    }),
    SlimLoadingBarModule.forRoot(),
    StoreModule.provideStore(appReducer),
    StoreDevtoolsModule.instrumentOnlyWithExtension({ maxAge: 5 }),
  ],
  bootstrap: [ IonicApp ],
  entryComponents: [ BreezeApp ],
  providers: [
    MediaCapture,
    Camera,
    File,
    FilePath,
    FileTransfer,
    StatusBar,
    SplashScreen,
    Keyboard,
    apiUrlProvider,
    HttpInterceptor,
    ConfigurationService,
    AndroidPermissions,
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler,
    },
  ],
})
export class AppModule {}
