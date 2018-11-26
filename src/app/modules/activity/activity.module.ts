import { ActivityMenuPage } from './pages/activity-menu.page';
import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ActivityPage } from './pages/activity.page';
import { NotificationsPage } from './pages/notifications.page';
import { EffectsModule } from '@ngrx/effects';
import { ActivityEffects } from './effects/activity.effects';
import { NotificationsEffects } from './effects/notifications.effects';
import { UserComponentsModule } from '../user/components/user-components.module';
import { PipesModule } from './../../pipes/pipes.module';

@NgModule({
  imports: [
    IonicModule,
    EffectsModule.run(ActivityEffects),
    EffectsModule.run(NotificationsEffects),
    UserComponentsModule,
    PipesModule,
  ],
  declarations: [ ActivityPage, NotificationsPage, ActivityMenuPage ],
  entryComponents: [ ActivityPage, NotificationsPage, ActivityMenuPage ],
})
export class ActivityModule {}
