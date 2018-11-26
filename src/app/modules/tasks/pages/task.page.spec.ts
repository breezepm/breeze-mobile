import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { IonicModule, App, NavController, Config, Platform, DomController, Keyboard } from 'ionic-angular';
import { Store } from '@ngrx/store';

import { AppMock, ConfigMock, DomMock, NavMock, PlatformMock } from '../../../../mocks/global.mocks';
import { TaskPage } from './task.page';

describe('Task Page', () => {
  let fixture: ComponentFixture<TaskPage>;
  let taskPage: any;

  const storeStub = {
    select: jasmine.createSpy('store select'),
  };

  function preTest() {
    TestBed.configureTestingModule({
      imports: [ IonicModule ],
      declarations: [ TaskPage ],
      providers: [
        { provide: Store, useValue: storeStub },
        { provide: App, useClass: AppMock },
        { provide: DomController, useValue: DomMock() },
        { provide: NavController, useClass: NavMock },
        { provide: Keyboard, useValue: {} },
        { provide: Config, useClass: ConfigMock },
        { provide: Platform, useClass: PlatformMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskPage);

    fixture.detectChanges();

    taskPage = fixture.nativeElement;
  }

  function posTest() {
    fixture.destroy();
  }

  afterEach(posTest);
  beforeEach(async(preTest));
});
