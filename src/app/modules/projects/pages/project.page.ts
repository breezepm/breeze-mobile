import { Slides, NavParams, PopoverController, NavController, ModalController,
  Modal, Keyboard, Platform } from 'ionic-angular';
import {
  Component, OnInit, ViewChild, ElementRef, NgZone,
  ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { DragulaService } from 'ng2-dragula';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/debounceTime';
import { Observable, Subject } from 'rxjs/';
import {
  pathOr, path, identity, compose, not, isNil,
  is, lte, length, where, equals, gt, both, prop, pipe,
} from 'ramda';
import {
  updateStageName, fetchProject, loadMoreTasks, StageLocator, NewTask,
  addTask, taskDropped, DropLocator, DroppedTaskLocator, resetSubstates,
} from './../actions/project.actions';
import { TaskParams, OriginPage } from './../../tasks/actions/task.actions';
import { AppState } from './../../../app.reducer';
import { ProjectDetails } from './../../../models/projects/project-details.model';
import { ProjectPopoverPage } from './project-popover.page';
import { PopoverForStage } from './popoverForStage.page';
import { ProjectPopoverTablet } from './project-popover-tablet.page';
import { TaskPage } from './../../tasks/pages/task.page';
import { mapDropEventToIds, extendIdsObj } from '../../../helpers/map-drop-events-to-ids';
import { isTablet } from '../../../helpers/is-tablet.ts';
import { isDefined } from '../../../helpers/path-is-defined';
import { User } from '../../../models/user/user-credentials.model';

interface SlidePosition {
  isFirst: boolean;
}

type StageAction = 'addStage'|'removeStage';

type Direction = 'left'|'right';

const lengthGte15 = compose(lte(15), length);

const getAutoscrollZone = (leftBarSize: number) => ({ leftBarSize, rightBarSize: window.innerWidth - leftBarSize });

@Component({
  selector: 'page-project',
  templateUrl: 'project.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectPage implements OnInit, OnDestroy {

  public isAddTaskClosed = false;

  public bagName = 'tasks-bag';

  public currentUser: User;

  public stageForm: FormGroup;

  public listNameForm: FormGroup;

  public project: ProjectDetails;

  public swimlanes: any;

  public firstSwimlane: any;

  public currentlyLoadingStageSwimlaneId = 'inactive';

  public isTablet = false;

  public headerTitle = '';

  public howManySlides = 1;

  public formsArray = [];

  private killer$: Subject<any> = new Subject();

  private prevStage: { idx: number; name: string; } = { idx: NaN, name: '' };

  private autoScrollZone: { leftBarSize: number; rightBarSize: number; };

  private timerLeft = false;

  private timerRight = false;

  private eventCache: any;

  private timeoutId: any;

  private slidesTimeoutId: any;

  private scrollPosition = 0;

  private horizontalScrollPosition = 0;

  private barsHeight: { topBarSize: number; bottomBarSize: number; };

  private dragabble = false;

  private currentIndexFromTouch: number;

  private touchDetectionZone = 40;

  private timeoutHolder: any;

  private touchStartDelay = 50;

  @ViewChild(Slides) private slides: Slides;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private params: NavParams,
    private popoverCtrl: PopoverController,
    private navCtrl: NavController,
    private dragula: DragulaService,
    private keyboard: Keyboard,
    private modalCtrl: ModalController,
    private elementRef: ElementRef,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef,
    public plt: Platform
  ) {
    this.slideSlides = this.slideSlides.bind(this);
  }

  public ngOnInit(): void {
    this.detectTablet();
    this.getCurrentUser();
    this.fetchProject();
    this.stageForm = this.fb.group({
      stageName: ['', Validators.required ],
    });
    if (this.currentUser.observer) {
      this.stageForm.get('stageName').disable();
    }
    this.dragula.setOptions(this.bagName, {
      mirrorContainer: document.querySelector('page-project'),
      ignoreInputTextSelection: false,
    });

    this.ngZone.runOutsideAngular(() => {

      window.addEventListener('orientationchange', () => {
        setTimeout(() => {
          this.autoScrollZone = getAutoscrollZone(this.touchDetectionZone);
        }, 500);
        this.setSidesHeight(this.touchDetectionZone);
        this.cd.markForCheck();
      }, false);

      this.elementRef.nativeElement.addEventListener('touchmove', (event) => {
        if (!this.dragabble) {
          event.stopPropagation();
          clearTimeout(this.timeoutHolder);
        }
      });

      this.elementRef.nativeElement.addEventListener('touchstart', () => {
        this.timeoutHolder = setTimeout(() => {
          this.dragabble = true;
        }, this.touchStartDelay);
      });

      this.elementRef.nativeElement.addEventListener('touchend', () => {
        this.dragabble = false;
        clearTimeout(this.timeoutHolder);
      });
    });
  }

  public ionViewWillEnter(): void {
    this.getCurrentUser();
    this.autoScrollZone = getAutoscrollZone(this.touchDetectionZone);
    this.connectDragula();
    this.watchProject();
    this.watchLoadingMoreTasks();
    this.watchAddOrRemoveStage();
    this.watchDragAndDrop();
  }

  public ionViewWillLeave(): void {
    clearTimeout(this.slidesTimeoutId);
    clearTimeout(this.timeoutHolder);
    this.killer$.next(true);
    this.store.dispatch(resetSubstates());
  }

  public ngOnDestroy() {
    this.dragula.destroy(this.bagName);
  }

  public lockSwipes() {
    this.isAddTaskClosed = false;
    this.slides.lockSwipes(true);
    this.cd.markForCheck();
  }

  public unlockSwipes() {
    this.slides.lockSwipes(false);
    this.isAddTaskClosed = true;
    this.cd.markForCheck();
  }

  public openAddTask() {
    this.isAddTaskClosed = false;
    this.cd.markForCheck();
  }

  public trackById(_, item): number {
    return prop<number>('id', item);
  }

  public swipeSlides(ev): void {
    ev.deltaX > 0 ? this.slides.slidePrev() : this.slides.slideNext();
  }

  public openPopover(ev: Event): void {
    const stageLocator: StageLocator = { projectId: this.projectId, stageId: this.stageId };

    this.popoverCtrl
      .create(ProjectPopoverPage, stageLocator)
      .present({ ev });
  }

  public openPopoverForProject(ev: Event): void {
    const stageLocator: StageLocator = { projectId: this.projectId, stageId: this.stageId };

    this.popoverCtrl
      .create(ProjectPopoverTablet, stageLocator)
      .present({ ev });
  }

  public openPopoverForStage(ev: Event, index: number): void {
    const stageIndex = path<number>(['stages', index, 'id'], this.firstSwimlane);
    const stageLocator: StageLocator = { projectId: this.projectId, stageId: stageIndex };

    this.popoverCtrl
      .create(PopoverForStage, stageLocator)
      .present({ ev });
  }

  public slideChanged(): void {
    this.updateHeaderName(this.currentIndex);
  }

  public updateStageName(evt): void {
    if (this.canUpdateStageName && evt) {
      const isKeyboardEvent = evt.type.toLocaleLowerCase() === 'keyup';
      const isEnterKey = evt.keyCode === 13;

      if ((isKeyboardEvent && isEnterKey) || !isKeyboardEvent) {
        const stageName: string = this.stageForm.value.stageName;
        const stageLocator: StageLocator = { projectId: this.projectId, stageId: this.stageId, stageName };

        this.prevStage = { idx: this.currentIndex, name: stageName };
        this.keyboard.close();

        this.store.dispatch(updateStageName(stageLocator));
      }
    }
  }

  public updateOneStageName(formName: string, stageIndexId: number): void {
    const stageId = path<number>(['stages', stageIndexId, 'id'], this.firstSwimlane);
    if (this.canUpdateStageNameOne(formName, stageId)) {
      const stageName: string = this.formsArray[formName].value.listName;
      const stageLocator: StageLocator = { projectId: this.projectId, stageId, stageName };
      this.prevStage = { idx: stageId, name: stageName };
      this.keyboard.close();
      this.store.dispatch(updateStageName(stageLocator));
    }
  }

  public addNewTask(newTask: NewTask) {

    if (!isNil(this.slides)) {
      this.slides.lockSwipes(false);
    }

    if (is(Object, newTask)) {
      this.store.dispatch(addTask({ ...newTask, projectId: this.projectId }));
    }
  }

  public openTask(taskId: number, stageId: number, swimlaneId: number) {
    const origin: OriginPage = 'ProjectPage';
    const taskParams: TaskParams = { stageId, taskId, projectId: this.projectId, origin, swimlaneId };
    const modal: Modal = this.modalCtrl.create(TaskPage, { taskParams });
    modal.present();
  }

  public loadMoreTasks(stage: any, swimlaneId: number): void {
    this.currentlyLoadingStageSwimlaneId = `${stage.id}#${swimlaneId}`;
    this.cd.markForCheck();
    this.store.dispatch(loadMoreTasks({
      projectId: this.projectId,
      stageId: stage.id,
      page: stage.page,
      swimlaneId,
    }));
  }

  public isLoading(stageId: any, swimlaneId: number): boolean {
    const loadingStageSwimlaTasksId = `${stageId}#${swimlaneId}`;
    return this.currentlyLoadingStageSwimlaneId === loadingStageSwimlaTasksId;
  }

  public showLoadMoreButton(swimlane, stageIndex): boolean {
    const stage = path(['stages', stageIndex], swimlane);

    return where({ load_more: equals(true), cards: lengthGte15 }, stage);
  }

  private getCurrentUser(): void {
    this.selectFromStore('user', 'fetchCurrentUser', 'value')
      .subscribe((user: User) => {
        this.currentUser = user;
      });
  }

  private selectFromStore<T>(...selectPath: string[]): Observable<T> {
    return this.store
      .select<T>(...selectPath)
      .filter(isDefined)
      .takeUntil(this.killer$);
  }

  private createForms() {
    this.project.swimlanes[0].stages.forEach((_, index) => {
      this.formsArray['listNameForm' + index] = this.fb.group({
        listName: ['', Validators.required],
      });
      this.formsArray['listNameForm' + index].setValue({listName: this.project.swimlanes[0].stages[index].name});
    });
  }

  private detectTablet(): void {
    this.isTablet = isTablet();
    this.cd.markForCheck();
  }

  private fetchProject(): void {
    this.store.dispatch(fetchProject(this.projectId));
  }

  private updateHeaderName(stageIndex: number): void {
    const isNumberAndLessThanStagesLength = both(is(Number), gt(this.firstSwimlane.stages.length));

    if (isNumberAndLessThanStagesLength(stageIndex)) {
      const stageName = pathOr('', ['stages', stageIndex, 'name'], this.firstSwimlane);

      this.stageForm.setValue({ stageName });
    }
  }

  private watchDragAndDrop(): void {
    this.dragula.dropModel
      .map<any[], DropLocator>(mapDropEventToIds)
      .map<DropLocator, DroppedTaskLocator>((idsObj) => extendIdsObj(idsObj, this.project))
      .takeUntil(this.killer$)
      .subscribe((idsObj) => {
        this.store.dispatch(taskDropped(idsObj));
        this.cd.markForCheck();
      });
  }

  private watchProject(): void {
    const project$: Observable<ProjectDetails> = this.store
      .select('project', 'fetchProject', 'value')
      .filter(compose(not, isNil, path(['swimlanes'])));

    project$
      .takeUntil(this.killer$)
      .subscribe((project) => {
        const stageIndex = this.slides == null ? 0 : this.currentIndex;

        this.project = project;
        this.firstSwimlane = path(['swimlanes', 0], project);
        this.swimlanes = this.project.swimlanes;
        this.updateHeaderName(stageIndex);
        this.headerTitle = this.project.name;

        if (this.isTablet) {
          this.createForms();
        }

        if (!this.isTablet) {
          this.slidesTimeoutId = setTimeout(() => {
            this.slides.onlyExternal = true;
          }, 500);
        }
        this.cd.markForCheck();
      });
  }

  private watchLoadingMoreTasks(): void {
    const isPending$ = this.store
      .select<boolean>('project', 'loadMoreTasks', 'pending');

    isPending$
      .takeUntil(this.killer$)
      .filter(not)
      .subscribe(() => {
        this.currentlyLoadingStageSwimlaneId = 'inactive';
        this.cd.markForCheck();
    });
  }

  private scrollToTheEnd() {
    this.horizontalScrollPosition = this.getElement('.scroll-content', 0).scrollLeft;
    const scrollWidth = this.getElement('.scroll-content', 0).scrollWidth;
    const howMuchTillEnd = scrollWidth - this.horizontalScrollPosition;
    const step = 50;
    const howManySteps = howMuchTillEnd / step;
    const interval$ = Observable.interval(16);
    interval$
      .take(howManySteps)
      .subscribe(() => {
        this.horizontalScrollPosition = this.horizontalScrollPosition + step;
        this.getElement('.scroll-content', 0).scrollLeft = this.horizontalScrollPosition;
      });
  }

  private watchAddOrRemoveStage(): void {
    const addStageSuccess$ = this.selectStageAction('addStage');

    addStageSuccess$.subscribe(({ isFirst }) => {
      if (!isNil(this.slides)) {
        this.transitionSlide(isFirst, this.slides.length());
      } else {
        this.scrollToTheEnd();
      }
      this.cd.markForCheck();
    });

    const removeStageSuccess$ = this.selectStageAction('removeStage');

    removeStageSuccess$.subscribe(({ isFirst }) => {
      if (!isNil(this.slides)) {
        if (this.slides.length() > 0) {
          this.transitionSlide(isFirst, this.currentIndex);
        } else {
          this.navCtrl.pop();
        }
        this.cd.markForCheck();
      }
    });
  }

  private transitionSlide(isFirst: boolean, relativeIndex: number): void {
    const firstIndex = 0;
    if (isFirst) {
      this.updateHeaderName(firstIndex);
    }
    this.slides.slideTo(Math.max(firstIndex, relativeIndex - 1));
  }

  private selectStageAction(action: StageAction): Observable<SlidePosition> {
    const first = isNil(this.slides) ? { isFirst: false } : { isFirst: this.slides.isBeginning() };

    return this.store.select<boolean>('project', action, 'success')
      .filter(identity)
      .takeUntil(this.killer$)
      .map((): SlidePosition => (first))
      .debounceTime(300);
  }

  private setTimer(direction: Direction) {
    this.timeoutId = setTimeout(() => {
      if (direction === 'left') {
        this.timerLeft = false;
      } else {
        this.timerRight = false;
      }
    }, 1250);
  }

  private slideSlides(event): void {
    event instanceof TouchEvent ? this.eventCache = event : event = this.eventCache;
    const clientX = event instanceof TouchEvent ? event.targetTouches[0].clientX : 0;
    if (this.autoScrollZone.leftBarSize > clientX && !this.timerLeft) {
      clearTimeout(this.timeoutId);
      this.setTimer('left');
      this.slides.slidePrev();
      this.timerLeft = true;
      this.timerRight = false;
    } else if (this.autoScrollZone.rightBarSize < clientX  && !this.timerRight) {
      clearTimeout(this.timeoutId);
      this.setTimer('right');
      this.slides.slideNext();
      this.timerLeft = false;
      this.timerRight = true;
    }
  }

  private setSidesHeight(size) {
    const scrollContainer = this.isTablet ? '.scroll-content' : '.scroll-container';

    const clientRect =  this.getElement(scrollContainer, this.currentIndex)
      .getBoundingClientRect();
    this.barsHeight = {
      topBarSize: clientRect.top + size,
      bottomBarSize: clientRect.bottom - size,
    };
  }

  private scrollUp(): void {
    this.getElement('.scroll-container', this.currentIndex)
      .scrollTop = this.scrollPosition - 10;
  }

  private scrollDown(): void {
    this.getElement('.scroll-container', this.currentIndex)
      .scrollTop = this.scrollPosition + 10;
  }

  private findStageIndexFromTouch(event: any): number {
    let el = event.target;
    while (el.parentNode) {
      el = el.parentNode;
      if (el.tagName === '.stage') {
        return el.id;
      }
    }
  }

  private verticalScroll(event): void {
    this.currentIndexFromTouch = this.findStageIndexFromTouch(event);

    event instanceof TouchEvent ? this.eventCache = event : event = this.eventCache;
    this.scrollPosition = this.getElement('.scroll-container', this.currentIndex).scrollTop;
    const clientY = event instanceof TouchEvent ? event.targetTouches[0].clientY : 0;

    if (this.barsHeight.topBarSize > clientY) {
      window.requestAnimationFrame(this.scrollUp.bind(this));
    }

    if (this.barsHeight.bottomBarSize < clientY) {
      window.requestAnimationFrame(this.scrollDown.bind(this));
    }
  }

  private scrollUpWhole() {
    this.getElement('.scroll-container', 0)
      .scrollTop = this.scrollPosition - 10;
  }

  private scrollDownWhole() {
    this.getElement('.scroll-container', 0)
      .scrollTop = this.scrollPosition + 10;
  }

  private getElement(cssSelector: string, index: number): any {
    return this.elementRef.nativeElement.querySelectorAll(cssSelector)[index];
  }

  private verticalScrollWhole(event): void {
    event instanceof TouchEvent ? this.eventCache = event : event = this.eventCache;
    this.scrollPosition = this.getElement('.scroll-container', 0).scrollTop;
    const clientY = event instanceof TouchEvent ? event.targetTouches[0].clientY : 0;

    if (this.barsHeight.topBarSize + 50 > clientY) {
      window.requestAnimationFrame(this.scrollUpWhole.bind(this));
    }

    if (this.barsHeight.bottomBarSize - 50 < clientY) {
      window.requestAnimationFrame(this.scrollDownWhole.bind(this));
    }
  }

  private scrollSlides(event: Event): void {
    event instanceof TouchEvent ? this.eventCache = event : event = this.eventCache;
    this.horizontalScrollPosition = this.getElement('.scroll-content', 0).scrollLeft;
    const clientX = event instanceof TouchEvent ? event.targetTouches[0].clientX : 0;

    if (this.autoScrollZone.leftBarSize > clientX) {
      window.requestAnimationFrame(this.scrollLeft.bind(this));
    }

    if (this.autoScrollZone.rightBarSize < clientX) {
      window.requestAnimationFrame(this.scrollRight.bind(this));
    }
  }

  private scrollLeft() {
    this.getElement('.scroll-content', 0)
      .scrollLeft = this.horizontalScrollPosition - 10;
  }

  private scrollRight() {
    this.getElement('.scroll-content', 0)
      .scrollLeft = this.horizontalScrollPosition + 10;
  }

  private connectDragula() {
    const touchMove$ = Observable.fromEvent<TouchEvent>(document, 'touchmove');
    const idle$ = Observable.interval(16).map(() => this.eventCache);
    const stopper$ = Observable.merge(this.dragula.drop, this.dragula.cancel);
    const clientMove$ = Observable.merge(touchMove$, idle$)
      .takeUntil(stopper$);

    this.dragula.drag
      .switchMap(() => clientMove$)
      .takeUntil(this.killer$)
      .subscribe((item) => {
        this.setSidesHeight(this.touchDetectionZone);
        this.isTablet ? this.scrollSlides(item) : this.slideSlides(item);
        this.isTablet ? this.verticalScrollWhole(item) : this.verticalScroll(item);
      });
  }

  private get projectId(): number {
    return this.params.get('projectId');
  }

  private get stageId(): number {
    return path<number>(['stages', this.currentIndex, 'id'], this.firstSwimlane);
  }

  private get currentIndex(): number {
    return (!isNil(this.slides)) ? this.slides.getActiveIndex() : 0;
  }

  private get canUpdateStageName(): boolean {
    const stageNameChanged = this.stageForm.value.stageName !== this.prevStage.name;
    const stageIndexChanged = this.currentIndex !== this.prevStage.idx;
    const stageChanged = stageNameChanged || stageIndexChanged;
    const locatorsAreDefined = is(Number, this.projectId) && is(Number, this.stageId);

    return stageChanged && locatorsAreDefined && this.stageForm.valid;
  }

  private canUpdateStageNameOne(stageName: string, stageIndex: number): boolean {
    const stageNameChanged = this.formsArray[stageName].value.listName !== this.prevStage.name;
    const stageIndexChanged = stageIndex !== this.prevStage.idx;
    const stageChanged = stageNameChanged || stageIndexChanged;
    const locatorsAreDefined = is(Number, this.projectId) && is(Number, this.stageId);
    return stageChanged && locatorsAreDefined && this.formsArray[stageName].valid;
  }

  private get isUserObserver(): boolean {
    return path<boolean>(['current_user', 'observer'], this.project);
  }
}
