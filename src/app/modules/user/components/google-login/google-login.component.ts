import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { loginWithGoogle } from '../../actions/user.actions';
import { AppState } from '../../../../app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'br-google-login',
  templateUrl: 'google-login.component.html',
  styles: [ 'google-login.componet.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoogleLoginComponent {

  @Input() public isSignUp: boolean;

  constructor(private store: Store<AppState>) {}

  public loginWithGoogle(): void {
    this.store.dispatch(loginWithGoogle());
  }
}
