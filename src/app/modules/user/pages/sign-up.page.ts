import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/map';

import { resetSignupState, signUp } from '../actions/user.actions';
import { AppState } from '../../../app.reducer';
import { CustomValidators } from '../../../shared/form/validators/custom-validators';

@Component({
  selector: 'br-sign-up-page',
  templateUrl: 'sign-up.page.html',
  styles: [ 'user.page.scss' ],
})
export class BrSignupPage implements OnInit {

  public serverErrorsStream$ = this.store.select('user')
    .map((userState: any) => userState.signUp.errorData);

  public form: FormGroup;

  public allowErrorDisplay: any = {
    email: false,
    password: false,
  };

  constructor(public store: Store<AppState>, public fb: FormBuilder) {}

  public ionViewWillLeave() {
    this.store.dispatch(resetSignupState());
    this.form.reset();
  }

  public ngOnInit(): void {
    this.createForm();
  }

  public handleSignup(): void {
    if (this.form.valid) {
     this.store.dispatch(signUp(this.form.value));
    }
  }

  public handleInputFocusOut(controlName: string): void {
    this.allowErrorDisplay[controlName] = true;
  }

  private createForm(): void {
    this.form = this.fb.group({
      email: [ '', [ CustomValidators.required('E-mail'), CustomValidators.email ] ],
      password: [ '', [ CustomValidators.required('Password'), CustomValidators.password ] ],
    });
  }
}
