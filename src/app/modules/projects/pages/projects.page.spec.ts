import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import {
  IonicModule, App, GestureController, Config, Platform, DomController,
  Keyboard, Form, NavController, ActionSheetController, ModalController,
} from 'ionic-angular';

import { BehaviorSubject } from 'rxjs/';

import { AppMock, ConfigMock, PlatformMock, DomMock, FormMock, NavMock } from '../../../../mocks/global.mocks';
import { ProjectsPage } from './projects.page';
import { Board } from '../../../models/projects/board.model';
import { HttpInterceptor } from '../../../providers/http.interceptor';
import { Store } from '@ngrx/store';
import { UserStateItem } from '../../user/reducers/user.reducer';
import { fetchTeamUsers } from '../../user/actions/user.actions';

describe('"Projects" Page', () => {
  let fixture: ComponentFixture<ProjectsPage>;
  let projectsPage: any;
  let instance: ProjectsPage;
  let GETResponse$: BehaviorSubject<Board[]>;
  let storeSelector$: BehaviorSubject<any>;
  let storeStub;

  const httpStub = {
    get() {
      //
    },
  };

  const initialState = {
    fetchTeamUsers: <UserStateItem> {
      error: false,
      errorData: null,
      pending: false,
      success: false,
      value: null,
    },
  };

  function preTest() {
    GETResponse$ = new BehaviorSubject([]);

    spyOn(httpStub, 'get').and.returnValue(GETResponse$);
    storeSelector$ = new BehaviorSubject(initialState);
    storeStub = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    storeStub.select.and.returnValue(storeSelector$);

    TestBed.configureTestingModule({
      imports: [ IonicModule ],
      declarations: [ ProjectsPage ],
      providers: [
        GestureController,
        ActionSheetController,
        { provide: App, useClass: AppMock },
        { provide: Config, useClass: ConfigMock },
        { provide: DomController, useValue: DomMock() },
        { provide: ModalController },
        { provide: Form, useClass: FormMock },
        { provide: Keyboard, useValue: {} },
        { provide: Platform, useClass: PlatformMock },
        { provide: NavController, useClass: NavMock },
        { provide: HttpInterceptor, useValue: httpStub },
        { provide: Store, useValue: storeStub },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsPage);

    fixture.detectChanges();

    projectsPage = fixture.nativeElement;
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
    expect(projectsPage).toBeDefined();
  });

  it('loads team users after view enters', () => {
    instance.ionViewWillEnter();
    expect(storeStub.dispatch).toHaveBeenCalledWith(fetchTeamUsers());
  });
});
