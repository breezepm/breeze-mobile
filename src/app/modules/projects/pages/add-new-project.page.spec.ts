import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActionSheetController, App, Config, DomController,
  Form, GestureController, IonicModule, Keyboard, ModalController,
  NavController, Platform, ViewController,
} from 'ionic-angular';

import { AppMock, ConfigMock, DomMock, FormMock, NavMock, PlatformMock } from '../../../../mocks/global.mocks';
import { Store } from '@ngrx/store';
import { AddNewProjectPage } from './add-new-project.page';
import { FilterByPropPipe } from '../../../pipes/user.search.pipe';
import { UserComponentsModule } from '../../user/components/user-components.module';

describe('Add new project Page', () => {
  let fixture: ComponentFixture<AddNewProjectPage>;
  let addNewProjectPage: any;
  let instance: AddNewProjectPage;
  const storeStub = {};

  function preTest() {
    TestBed.configureTestingModule({
      imports: [ IonicModule, UserComponentsModule ],
      declarations: [ AddNewProjectPage, FilterByPropPipe ],
      providers: [
        GestureController,
        ActionSheetController,
        { provide: App, useClass: AppMock },
        { provide: Config, useClass: ConfigMock },
        { provide: DomController, useValue: DomMock() },
        { provide: ModalController },
        { provide: ViewController },
        { provide: Form, useClass: FormMock },
        { provide: Keyboard, useValue: {} },
        { provide: Platform, useClass: PlatformMock },
        { provide: NavController, useClass: NavMock },
        { provide: Store, useValue: storeStub },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddNewProjectPage);

    fixture.detectChanges();

    addNewProjectPage = fixture.nativeElement;
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
    expect(addNewProjectPage).toBeDefined();
  });
});
