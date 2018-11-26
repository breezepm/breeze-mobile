import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  App,
  Config,
  DomController,
  Form,
  GestureController,
  IonicModule,
  Keyboard,
  LoadingController, ModalController,
  NavController,
  Platform
} from 'ionic-angular';

import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/';
import {
  AppMock,
  ConfigMock,
  DomMock,
  FormMock,
  LoadingControllerMock, ModalControllerMock,
  NavMock,
  PlatformMock
} from '../../../mocks/global.mocks';
import { MorePage } from './more.page';
import { UserStateItem } from './../user/reducers/user.reducer';
import { logout } from './../user/actions/user.actions';
import { UserComponentsModule } from './../user/components/user-components.module';

describe('"More" Page', () => {
  let fixture: ComponentFixture<MorePage>;
  let tasksPage;
  let instance: MorePage;
  let userSelector$: BehaviorSubject<any>;

  const networkDefault = {
    error: false,
    errorData: null,
    pending: false,
    success: false,
  };

  const networkSuccess = {
    ...networkDefault,
    success: true,
  };

  const storeMock = {
    dispatch: jasmine.createSpy('dispatch'),
    select: jasmine.createSpy('select'),
  };

  const user = {
    avatar: 'www.moj-avatar.pl',
    initials: 'JT',
    name: 'ja@ty.pl',
    color: 'fff',
    real_user_team_name: 'Team A',
    real_user_team_id: 1,
    teams: [
      {
        name: 'Team B',
        owner_email: '',
        team_id: 2,
      },
    ],
  };

  const initialState = {
    fetchCurrentUser: <UserStateItem> {
      ...networkDefault,
      value: null,
    },
    setUserTeam: <UserStateItem> {
      ...networkDefault,
      value: null,
    },
  };

  function preTest() {
    userSelector$ = new BehaviorSubject(initialState);
    storeMock.select.and.returnValue(userSelector$);

    TestBed.configureTestingModule({
      imports: [ IonicModule, UserComponentsModule ],
      declarations: [ MorePage ],
      providers: [
        { provide: App, useClass: AppMock },
        { provide: Config, useClass: ConfigMock },
        { provide: DomController, useValue: DomMock() },
        { provide: Form, useClass: FormMock },
        { provide: GestureController, useValue: {} },
        { provide: Keyboard, useValue: {} },
        { provide: LoadingController, useClass: LoadingControllerMock },
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: Platform, useClass: PlatformMock },
        { provide: Store, useValue: storeMock },
        { provide: NavController, useClass: NavMock },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(MorePage);

    fixture.detectChanges();

    tasksPage = fixture.nativeElement;
    instance = fixture.componentInstance;
  }

  function posTest() {
    fixture.destroy();
  }

  afterEach(posTest);
  beforeEach(async(preTest));

  it('should instantiate the component class', () => {
    expect(instance).toBeDefined();
  });

  it('should render the component', () => {
    expect(tasksPage).toBeDefined();
  });

  describe('when the view will enter', () => {

    beforeEach(() => instance.ionViewWillEnter());

    it('should show a placeholder component while the user is being fetched', () => {
      const spinner = tasksPage.querySelector('ion-spinner');
      expect(spinner).toBeDefined();
    });

    it('should show the user info after the store responds', () => {
      userSelector$.next({
        fetchCurrentUser: {
          ...networkSuccess,
          value: user,
        },
        setUserTeam: {
          ...networkSuccess,
          value: 1,
        },
      });

      fixture.detectChanges();

      const spinner = tasksPage.querySelector('ion-spinner');
      const ionItem = tasksPage.querySelector('ion-item');
      const ionAvatar = ionItem.querySelector('ion-icon');
      const img = ionAvatar.querySelector('img');
      const span = ionItem.querySelector('span');

      expect(spinner).toEqual(null);
      expect(img.getAttribute('src')).toBe(user.avatar);
      expect(span.innerText).toBe(user.name);
    });

  });

  describe('when the user clicks the logout button', () => {

    beforeEach(() => {
      const button: HTMLButtonElement = tasksPage.querySelector('.logout-button');
      button.click();
    });

    it('dispatches the logout action', () => {
      expect(storeMock.dispatch).toHaveBeenCalledWith(logout());
    });

  });

  describe('when the view will leave', () => {

    beforeEach(() => {
      instance.ionViewWillLeave();
    });

    it('should unsubscribe from the store.select observable', () => {
      expect(userSelector$.observers).toEqual([]);
    });

  });

});
