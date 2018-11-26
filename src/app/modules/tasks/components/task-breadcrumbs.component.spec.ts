import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { IonicModule, App, NavController, Config, Platform, DomController, Keyboard } from 'ionic-angular';

import { AppMock, ConfigMock, DomMock, NavMock, PlatformMock } from '../../../../mocks/global.mocks';
import { TaskBreadcrumbsComponent } from './task-breadcrumbs.component';

describe('Breadcrumbs component', () => {
  let fixture: ComponentFixture<TaskBreadcrumbsComponent>;
  let breadcrumbs: any;
  let instance: any;

  function preTest() {
    TestBed.configureTestingModule({
      imports: [ IonicModule ],
      declarations: [ TaskBreadcrumbsComponent ],
      providers: [
        { provide: App, useClass: AppMock },
        { provide: DomController, useValue: DomMock() },
        { provide: NavController, useClass: NavMock },
        { provide: Keyboard, useValue: {} },
        { provide: Config, useClass: ConfigMock },
        { provide: Platform, useClass: PlatformMock },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskBreadcrumbsComponent);

    fixture.detectChanges();

    breadcrumbs = fixture.nativeElement;
    instance = fixture.componentInstance;
  }

  function posTest() {
    fixture.destroy();
  }

  afterEach(posTest);
  beforeEach(async(preTest));

  describe('when setBreadcrumbs is called', () => {
    beforeEach(() => {
      const card = {
        card_name: 'foo',
        project: {
          name: 'bar',
        },
        stage: {
          name: 'buzz',
        },
      };
      instance.card = card;
      fixture.detectChanges();
      instance.setBreadcrumbs();
    });

    it('should set breadcrumbs', () => {
      expect(instance.breadcrumbs).toEqual('bar > buzz > foo');
    });
  });
});
