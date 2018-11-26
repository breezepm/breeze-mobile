import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Observable, Subject } from 'rxjs/';
import { compose } from 'ramda';

import { FetchedComment } from './../../../../models/task-comment/task-comment.model';
import { parseCreatedAtToText } from '../../../../helpers/parse-created-at-to-text';

const timeDifferenceInSec: (date: string) => number = createdAt => (Date.now() - Date.parse(createdAt)) / 1000;

@Component({
  selector: 'br-task-comment',
  templateUrl: 'task-comment.component.html',
  styles: [ 'task-comment.component.scss' ],
  providers: [ InAppBrowser ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCommentComponent implements OnInit, OnDestroy {
  public timeAgo: string;
  @Input() public comment: FetchedComment;

  private killer$: Subject<null> = new Subject();

  constructor(private inAppBrowser: InAppBrowser, private detector: ChangeDetectorRef) {}

  public ngOnInit(): void {
    if (this.comment != null) {
      const createdAt: string = this.comment.created_at || (new Date()).toISOString();

      Observable.timer(0, 60000)
        .mapTo(createdAt)
        .map(compose(parseCreatedAtToText, timeDifferenceInSec))
        .takeUntil(this.killer$)
        .subscribe(timeAgo => {
          this.timeAgo = timeAgo;
          this.detector.markForCheck();
        });
    }
  }

  public ngOnDestroy(): void {
    this.killer$.next();
  }

  public openLink(url: string): void {
    this.inAppBrowser.create(url, '_system', 'location=yes');
  }

  public trackById(_, item): number {
    if (item != null) {
      return item.id;
    }
  }

}
