import { Component, Input, OnChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/';
import 'rxjs/add/operator/map';

@Component({
  selector: 'form-error',
  templateUrl: 'form-error.component.html',
})
export class FormErrorComponent implements OnChanges {
  @Input() public clientErrors: AbstractControl;
  @Input() public serverLoginErrors$: Observable<any>;
  @Input() public serverSignupErrors$: Observable<any>;
  @Input() public allowDisplayErrors: boolean;

  private clientErrorMessages: string[] = [];
  private serverLoginErrorMsg$: any;
  private serverSignupErrorMsg$: any;

  public ngOnChanges(changes) {
    this.clientErrorMessages = this.clientErrors && this.allowDisplayErrors ?
      Object.keys(this.clientErrors).map(key => this.clientErrors[key].message) : [];

    if (changes.serverLoginErrors$) {
      this.serverLoginErrorMsg$ = this.serverLoginErrors$
        .map((serverDataError: any) => serverDataError ? 'Invalid e-mail or password' : '');
    }

    if (changes.serverSignupErrors$) {
      this.serverSignupErrorMsg$ = this.serverSignupErrors$
        .map((serverDataError: any) => serverDataError ? 'E-mail has already been taken' : '');
    }
  }
}
