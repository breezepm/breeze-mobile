import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrSignupPage } from './pages';
import { IonicModule } from 'ionic-angular';
import { BrSignInPage } from './pages/login.page';
import { UserEffects } from './effects/user.effects';
import { SharedModule } from '../../shared/shared.module';
import { UserComponentsModule } from './components/user-components.module';
import { GooglePlus } from '@ionic-native/google-plus';

@NgModule({
  declarations: [
    BrSignupPage,
    BrSignInPage,
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    EffectsModule.run(UserEffects),
    UserComponentsModule,
  ],
  providers: [ GooglePlus ],
  entryComponents: [
    BrSignupPage,
    BrSignInPage,
  ],
  exports: [
    BrSignupPage,
    BrSignInPage,
  ],
})

export class UserModule {}
