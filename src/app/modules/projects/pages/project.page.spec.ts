import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import {
  IonicModule, App, GestureController, Config, Platform, DomController,
  Form, NavController, ActionSheetController, ModalController,
  DeepLinker, NavParams, PopoverController,
} from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';

import { DragulaModule } from 'ng2-dragula';
import { BehaviorSubject } from 'rxjs/';

import { AppMock, ConfigMock, PlatformMock, DomMock, FormMock, NavMock } from '../../../../mocks/global.mocks';
import { ProjectPage } from './project.page';
import { ProjectDetails } from '../../../models/projects/project-details.model';
import { fetchProject } from './../actions/project.actions';
import { Store } from '@ngrx/store';
import { ProjectsComponentsModule } from './../components/projects-components.module';
import { DirectivesModule } from './../../../directives/directives.module';

xdescribe('"Project" Page', () => {
  // problem with the Keyboard provider
  let fixture: ComponentFixture<ProjectPage>;
  let projectPage: any;
  let instance: ProjectPage;
  let selectValue$: BehaviorSubject<any>;
  let selectPending$: BehaviorSubject<any>;
  let storeStub;

  const projectId: number = 1;

  const project: ProjectDetails = {
    id: projectId,
    name: 'Project A',
    description: 'It\'s awesome',
    current_user: {},
    current: {},
    users: [{}],
    workspace_id: 2,
    swimlanes: [
      {
        stages: [
          { name: 'Todo' },
        ],
      },
      {
        stages: [
          { name: 'Doing' },
        ],
      },
    ],
  };

  const popoverPRESENT = jasmine.createSpy('popoverPRESENT');

  const popoverCtrlStub = {
    create: jasmine.createSpy('popoverCREATE').and.returnValue({ present: popoverPRESENT }),
  };

  const navParamsStub = {
    get: jasmine.createSpy('navGET').and.returnValue(projectId),
  };

  function preTest() {
    selectValue$ = new BehaviorSubject(null);
    selectPending$ = new BehaviorSubject(false);

    storeStub = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    storeStub.select.and.callFake((...path: string[]) =>
      path.indexOf('value') === 2 ? selectValue$ : selectPending$
    );

    TestBed.configureTestingModule({
      imports: [ IonicModule, DragulaModule, ProjectsComponentsModule, DirectivesModule ],
      declarations: [ ProjectPage ],
      providers: [
        FormBuilder,
        GestureController,
        ActionSheetController,
        { provide: App, useValue: AppMock },
        { provide: PopoverController, useValue: popoverCtrlStub },
        { provide: NavParams, useValue: navParamsStub },
        { provide: Config, useClass: ConfigMock },
        { provide: DomController, useValue: DomMock() },
        { provide: Form, useClass: FormMock },
        { provide: DeepLinker, useValue: {} },
        { provide: ModalController, useValue: {} },
        { provide: Platform, useClass: PlatformMock },
        { provide: NavController, useClass: NavMock },
        { provide: Store, useValue: storeStub },
        { provide: Keyboard, useValue: {} },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectPage);

    fixture.detectChanges();

    projectPage = fixture.nativeElement;
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
    expect(projectPage).toBeDefined();
  });

  it('should fetch the project by id on init', () => {
    expect(storeStub.dispatch).toHaveBeenCalledWith(fetchProject(projectId));
  });

  xdescribe('when the view will enter for the first time', () => {
    /**
     * Todo: for now there's no possibility to test this. "Error during cleanup of component"
     * @see {@link https://github.com/driftyco/ionic-unit-testing-example/issues/22} for further information.
     */

    beforeEach(() => {
      instance.ionViewWillEnter();
      selectPending$.next(true);
      fixture.detectChanges();

      selectValue$.next(project);
      selectPending$.next(false);
      fixture.detectChanges();
    });

  });

});
