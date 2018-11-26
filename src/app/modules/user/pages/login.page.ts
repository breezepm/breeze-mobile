import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { NavController } from 'ionic-angular';
import 'rxjs/add/operator/map';

import { BrSignupPage } from './sign-up.page';
import { UserState } from '../reducers/user.reducer';
import { login, resetLoginState } from '../actions/user.actions';

@Component({
  selector: 'br-sign-in-page',
  templateUrl: 'login.page.html',
  styles: [ 'user.page.scss' ],
})
export class BrSignInPage implements OnInit {

  public serverErrorsStream$ = this.store.select('user')
    .map((userState: any) => userState.login.errorData);

  public form: FormGroup;

  constructor(public navCtrl: NavController, public store: Store<UserState>, public fb: FormBuilder) {}

  public ngOnInit(): void {
    this.createForm();
  }

  public handleLogin(): void {
    this.store.dispatch(login(this.form.value));
  }

  public navigateToSignUp(): void {
    this.store.dispatch(resetLoginState());
    this.form.reset();
    this.navCtrl.push(BrSignupPage);
  }

  private createForm(): void {
    this.form = this.fb.group({
      email: [ '' ],
      password: [ '' ],
    });
  }
}
