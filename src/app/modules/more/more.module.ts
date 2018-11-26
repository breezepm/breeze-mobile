import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { MorePage } from './more.page';
import { UserComponentsModule } from './../user/components/user-components.module';

@NgModule({
  imports: [ IonicModule, UserComponentsModule ],
  declarations: [ MorePage ],
  entryComponents: [ MorePage ],
})
export class MoreModule {}
