import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { GoogleLoginComponent } from './google-login/google-login.component';
import { IonicModule } from 'ionic-angular';

@NgModule({
  imports: [ CommonModule, IonicModule ],
  declarations: [ UserAvatarComponent, GoogleLoginComponent ],
  entryComponents: [ UserAvatarComponent, GoogleLoginComponent ],
  exports: [ UserAvatarComponent, GoogleLoginComponent ],
})
export class UserComponentsModule { }
