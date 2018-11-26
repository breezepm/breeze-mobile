import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrSignInPage } from './login.page';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UserStateItem } from '../reducers/user.reducer';
import { Store } from '@ngrx/store';
import { ConfigMock, PlatformMock } from '../../../../mocks/global.mocks';
import {
  App, Config, DomController, Form, GestureController,
  IonicModule, Keyboard, NavController, Platform,
} from 'ionic-angular';
import { FormErrorComponent } from '../../../shared/form/components/form-error.component';
import { login } from '../actions/user.actions';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core'

function triggerEventWithValue(element, eventType: string, value: any) {
  element.nativeElement.value = value;
  element.triggerEventHandler(eventType, { target: { value } });

  return element;
}

describe('Login Page', () => {
  let fixture: ComponentFixture<BrSignInPage>;
  let loginPage;
  let instance: BrSignInPage;
  let storeMock;
  let storeSelector$: BehaviorSubject<any>;

  const validFormData = {
    email: 'damian.bachorz@briisk.co',
    password: 'test12345',
  };

  const invalidFormData = {
    email: 'damian.bachorz@briisk.com',
    password: 'test12345',
  };

  const initialState = {
    login: <UserStateItem> {
      error: false,
      errorData: null,
      pending: false,
      success: false,
      value: null,
    },
  };

  function preTest() {
    storeSelector$ = new BehaviorSubject(initialState);
    storeMock = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    storeMock.select.and.returnValue(storeSelector$);

    TestBed.configureTestingModule({
      imports: [ IonicModule ],
      declarations: [ BrSignInPage, FormErrorComponent ],
      providers: [
        App, Keyboard, NavController, GestureController, DomController, Form,
        { provide: Config, useClass: ConfigMock },
        { provide: Platform, useClass: PlatformMock },
        { provide: Store, useValue: storeMock },
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(BrSignInPage);

    fixture.detectChanges();

    loginPage = fixture.nativeElement;
    instance = fixture.componentInstance;
  }

  function postTests() {
    fixture.destroy();
  }

  afterEach(postTests);
  beforeEach(async(preTest));

  it('should instantiate the component class', () => {
    expect(instance).toBeDefined();
  });

  it('should render the component', () => {
    expect(loginPage).toBeDefined();
  });

  describe('when the user fills form with valid data and logs in', () => {
    beforeEach(() => {
      const [ emailInput, passwordInput ] = fixture.debugElement.queryAll(By.css('.text-input'));

      triggerEventWithValue(emailInput, 'input', validFormData.email);
      triggerEventWithValue(passwordInput, 'input', validFormData.password);

      const button: HTMLButtonElement = loginPage.querySelector('.submit-button');
      button.click();
      fixture.detectChanges();
    });

    it('should dispatch the login action', () => {
      expect(storeMock.dispatch).toHaveBeenCalledWith(login(validFormData));
    });
  });

  describe('when the user fills form with invalid data and logs in', () => {
    beforeEach(() => {
      const [ emailInput, passwordInput ] = fixture.debugElement.queryAll(By.css('.text-input'));

      triggerEventWithValue(emailInput, 'input', invalidFormData.email);
      triggerEventWithValue(passwordInput, 'input', invalidFormData.password);

      const button: HTMLButtonElement = loginPage.querySelector('.submit-button');
      button.click();

      fixture.detectChanges();
    });

    it('should dispatch the login action', () => {
      expect(storeMock.dispatch).toHaveBeenCalledWith(login(invalidFormData));
    });

    const errValue = 'Invalid e-mail or password';

    const errorData = {
      json: () => ({ error: errValue }),
    };

    initialState.login.errorData = errorData;

    it('should send errors stream to errors component', () => {
      storeSelector$.next(initialState);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('form-error')).componentInstance.serverLoginErrors$)
        .toBe(instance.serverErrorsStream$);
    });

    it('should show error on login page', () => {
      const visibleError = loginPage.querySelector('.error-message').innerHTML;
      expect(visibleError).toBe(errValue);
    });
  });
});
