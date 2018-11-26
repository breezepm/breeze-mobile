import { NgModule } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';

import { IonicRxStorage } from './ionic-rx-storage.provider';

@NgModule({
  imports: [ IonicStorageModule.forRoot() ],
  providers: [ IonicRxStorage ],
})
export class IonicRxStorageModule {}
