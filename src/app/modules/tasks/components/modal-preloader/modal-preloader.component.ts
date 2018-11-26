import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Subject } from 'rxjs/';

@Component({
  selector: 'modal-preloader',
  templateUrl: 'modal-preloader.component.html',
  styles: [ 'modal-preloader.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ModalPreloaderComponent implements OnInit, OnDestroy {

  public barWidth = '0%';
  public isHidden = true;
  private killer$ = new Subject<any>();

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private detector: ChangeDetectorRef,
  ) {}

  public ngOnInit() {
    this.preloaderSubscriber();
  }

  public ngOnDestroy() {
    this.killer$.next();
  }

  private preloaderSubscriber() {
    this.slimLoadingBarService.events
      .takeUntil(this.killer$)
      .filter((item) => item.type === 0)
      .subscribe(
        (item) => {
          this.barWidth = item.value + '%';
          this.detector.markForCheck();
        }
    );
  }
}
