import { Keyboard } from '@ionic-native/keyboard';
import { Component, ElementRef, Output, EventEmitter, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { isInputOrTextAreaElement, getContentEditableCaretCoords, camelize } from './mention-utils';
import { getCaretCoordinates } from './caret-coords';

/**
 * Angular 2 Mentions.
 * https://github.com/dmacfarlane/angular2-mentions
 *
 * Copyright (c) 2016 Dan MacFarlane
 */
@Component({
  selector: 'mention-list',
  styles: [ 'mention-list.component.scss' ],
  template: `
    <ul class="dropdown-menu scrollable-menu" #list [hidden]="hidden">
        <li *ngFor="let item of items; let i = index" [class.active]="activeIndex==i">
          <a class="dropdown-item" (tap)="activeIndex=i;itemClick.emit($event); preventBubble($event)">
            <b class="name" *ngIf="item.name !== item.email">{{ item.name }}</b> <span class="atwho-inserted">{{item.email }}</span>
          </a>
        </li>
    </ul>
    `,
})
export class MentionListComponent {
  items = [];
  activeIndex: number = 0;
  hidden: boolean = false;
  @ViewChild('list') list : ElementRef;
  @Output() itemClick = new EventEmitter();
  public isTaskPage: boolean;
  public isListPositionOver = false;
  private isFirst = true;

  constructor(public _element: ElementRef) {}

  // lots of confusion here between relative coordinates and containers
  position(nativeParentElement: any, iframe: HTMLIFrameElement = null, viewHeight : number, isTaskPage: boolean) {
    let coords = { top: 0, left: 0 };
    let coordsCorrection: number;
    
    if (isInputOrTextAreaElement(nativeParentElement)) {
      // parent elements need to have postition:relative for this to work correctly?
      coords = getCaretCoordinates(nativeParentElement, nativeParentElement.selectionStart);
      coords.top = nativeParentElement.offsetTop + coords.top + 16;
      coords.left = nativeParentElement.offsetLeft + coords.left;
    }
    else if (iframe) {
      let context: { iframe: HTMLIFrameElement, parent: Element } = { iframe: iframe, parent: iframe.offsetParent };
      coords = getContentEditableCaretCoords(context);
    }
    else {
      let doc = document.documentElement;
      let scrollLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
      let scrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
      // bounding rectangles are relative to view, offsets are relative to container?
      let caretRelativeToView = getContentEditableCaretCoords({ iframe: iframe });
      let parentRelativeToContainer: ClientRect = nativeParentElement.getBoundingClientRect();

      coords.left = caretRelativeToView.left - parentRelativeToContainer.left + nativeParentElement.offsetLeft - scrollLeft;
      coords.top = caretRelativeToView.top - parentRelativeToContainer.top + nativeParentElement.offsetTop - scrollTop;
      
      if (this.isFirst) {
        if (coords.top > 300) {
          coordsCorrection = caretRelativeToView.top - parentRelativeToContainer.top + nativeParentElement.offsetTop - scrollTop;
        }
        this.isFirst = false;
      } else {
        coordsCorrection = coords.top;
      }
    }
    const searchListMaxHeight = 200;
    const lineHeight = 30;
    const margin = 5;
    let computedPosition: number;
    let el: HTMLElement = this._element.nativeElement;

    if (coordsCorrection > (searchListMaxHeight + lineHeight) || isTaskPage) {
      computedPosition = coords.top - lineHeight - searchListMaxHeight;
      this.isListPositionOver = true;
    } else {
      computedPosition = coords.top + margin;
      this.isListPositionOver = false;
    }

    el.style.position = "absolute";
    el.style.left = 0 + 'px';
    el.style.top = computedPosition + 'px';
  }

  get carretPosition() {
    return getContentEditableCaretCoords({ iframe: null }).top;
  }

  get activeItem() {
    const activeItem = this.items[this.activeIndex];
    return activeItem.name ? camelize(activeItem.name) : activeItem.email;
  }

  get activeItemId() {
    return this.items[this.activeIndex].id;
  }

  public preventBubble(event) {
    event.preventDefault();
  }

  activateNextItem() {
    // adjust scrollable-menu offset if the next item is out of view
    let listEl: HTMLElement = this.list.nativeElement;
    let activeEl = listEl.getElementsByClassName('active').item(0);
    if (activeEl) {
      let nextLiEl: HTMLElement = <HTMLElement> activeEl.nextSibling;
      if (nextLiEl && nextLiEl.nodeName === "LI") {
        let nextLiRect: ClientRect = nextLiEl.getBoundingClientRect();
        if (nextLiRect.bottom > listEl.getBoundingClientRect().bottom) {
          listEl.scrollTop = nextLiEl.offsetTop + nextLiRect.height - listEl.clientHeight;
        }
      }
    }
    // select the next item
    this.activeIndex = Math.max(Math.min(this.activeIndex + 1, this.items.length - 1), 0);
  }

  activatePreviousItem() {
    // adjust the scrollable-menu offset if the previous item is out of view
    let listEl: HTMLElement = this.list.nativeElement;
    let activeEl = listEl.getElementsByClassName('active').item(0);
    if (activeEl) {
      let prevLiEl: HTMLElement = <HTMLElement> activeEl.previousSibling;
      if (prevLiEl && prevLiEl.nodeName == "LI") {
        let prevLiRect: ClientRect = prevLiEl.getBoundingClientRect();
        if (prevLiRect.top < listEl.getBoundingClientRect().top) {
          listEl.scrollTop = prevLiEl.offsetTop;
        }
      }
    }
    // select the previous item
    this.activeIndex = Math.max(Math.min(this.activeIndex - 1, this.items.length - 1), 0);
  }

  resetScroll() {
    this.list.nativeElement.scrollTop = 0;
  }
}
