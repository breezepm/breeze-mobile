import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UserStateItem } from '../reducers/user.reducer';
import { Store } from '@ngrx/store';
import { ConfigMock, PlatformMock } from '../../../../mocks/global.mocks';
import {
  App, Config, DomController, Form, GestureController,
  IonicModule, Keyboard, NavController, Platform,
} from 'ionic-angular';
import { FormErrorComponent } from '../../../shared/form/components/form-error.component';
import { signUp } from '../actions/user.actions';
import { BrSignupPage } from './sign-up.page';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

function triggerEventWithValue(element, eventType: string, value: any) {
  element.nativeElement.value = value;
  element.triggerEventHandler(eventType, { target: { value } });

  return element;
}

describe('Sign up Page', () => {
  let fixture: ComponentFixture<BrSignupPage>;
  let signUpPage;
  let instance: BrSignupPage;
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
    signUp: <UserStateItem> {
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
      declarations: [ BrSignupPage, FormErrorComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        App, Keyboard, NavController, GestureController, DomController, Form,
        { provide: Config, useClass: ConfigMock },
        { provide: Platform, useClass: PlatformMock },
        { provide: Store, useValue: storeMock },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(BrSignupPage);

    fixture.detectChanges();

    signUpPage = fixture.nativeElement;
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
    expect(signUpPage).toBeDefined();
  });

  describe('when the user fills form with valid data and registers', () => {
    beforeEach(() => {
      const [ emailInput, passwordInput ] = fixture.debugElement.queryAll(By.css('.text-input'));

      triggerEventWithValue(emailInput, 'input', validFormData.email);
      triggerEventWithValue(passwordInput, 'input', validFormData.password);

      const button: HTMLButtonElement = signUpPage.querySelector('.submit-button');
      button.click();
      fixture.detectChanges();
    });

    it('should dispatch the sign up action', () => {
      expect(storeMock.dispatch).toHaveBeenCalledWith(signUp(validFormData));
    });
  });

  describe('when the user fills form with invalid data and logs in', () => {
    beforeEach(() => {
      const [ emailInput, passwordInput ] = fixture.debugElement.queryAll(By.css('.text-input'));

      triggerEventWithValue(emailInput, 'input', invalidFormData.email);
      triggerEventWithValue(passwordInput, 'input', invalidFormData.password);

      const button: HTMLButtonElement = signUpPage.querySelector('.submit-button');
      button.click();

      fixture.detectChanges();
    });

    it('should dispatch the sign up action', () => {
      expect(storeMock.dispatch).toHaveBeenCalledWith(signUp(invalidFormData));
    });

    const errValue = 'E-mail has already been taken';

    const errorData = {
      json: () => ({ error: errValue }),
    };

    initialState.signUp.errorData = errorData;

    it('should send errors stream to errors component', () => {
      storeSelector$.next(initialState);
      fixture.detectChanges();

      const serverErrorsComponent = fixture.debugElement.queryAll(By.css('form-error'))[2];

      expect(serverErrorsComponent.componentInstance.serverSignupErrors$)
        .toBe(instance.serverErrorsStream$);
    });

    it('should show error on sign up page', () => {
      const singleServerErrorText = signUpPage.querySelectorAll('.error-message')[5].innerHTML;
      expect(singleServerErrorText).toBe(errValue);
    });
  });
});
