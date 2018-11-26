import { Directive, ElementRef, Input, ComponentFactoryResolver, ViewContainerRef, OnChanges } from "@angular/core";
import { EventEmitter, Output, SimpleChanges } from "@angular/core";
import { Platform } from 'ionic-angular'
import { MentionListComponent } from './mention-list.component';
import {
  getValue, insertValue, getCaretPosition, setCaretPosition, isInputOrTextAreaElement,
  getWindowSelection
} from './mention-utils';

const KEY_BACKSPACE = 8;
const KEY_TAB = 9;
const KEY_ENTER = 13;
const KEY_SHIFT = 16;
const KEY_ESCAPE = 27;
const KEY_SPACE = 32;
const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const KEY_2 = 50;

/**
 * Angular 2 Mentions.
 * https://github.com/dmacfarlane/angular2-mentions
 *
 * Copyright (c) 2017 Dan MacFarlane
 */
@Directive({
  selector: '[mention]',
  host: {
    '(input)': 'onInputChange($event)',
    '(keydown)': 'iosKeyHandler($event)',
    '(keyup)': 'androidKeyHandler($event)',
    '(ionBlur)': 'blurHandler($event)',
  },
})
export class MentionDirective implements OnChanges {

  @Input() set mention(items:any[]){
    this.items = items;
  }

  @Input() set mentionConfig(config: any) {
    this.triggerChar = config.triggerChar || this.triggerChar;
    this.labelKey = config.labelKey || this.labelKey;
    this.disableSearch = config.disableSearch || this.disableSearch;
    this.maxItems = config.maxItems || this.maxItems;
    this.mentionSelect = config.mentionSelect || this.mentionSelect;
  }

  @Input() textareaValue: any;

  @Input() viewHeight: number;

  @Input() isTaskPage = false;
  @Input() taskPageSaveEvent = false;

  // event emitted whenever the search term changes
  @Output() searchTerm = new EventEmitter();

  // emit when user selects item
  @Output() itemSelected = new EventEmitter();

  // the character that will trigger the menu behavior
  private triggerChar: string = "@";

  // option to specify the field in the objects to be used as the item label
  private labelKey: string = 'email';

  // option to diable internal filtering. can be used to show the full list returned
  // from an async operation (or allows a custom filter function to be used - in future)
  private disableSearch: boolean = false;

  // option to limit the number of items shown in the pop-up menu
  private maxItems: number = -1;

  // optional function to format the selected item before inserting the text
  private mentionSelect: (selection: string) => (string) = (selection: string) => selection;

  private atCounterPrev = 0;
  private atCounterCurrent = 0;
  private isIos: boolean;
  private isSemaphore = true;

  searchString: string;
  startPos: number;
  items = [];
  startNode;
  searchList: MentionListComponent;
  stopSearch: boolean;
  iframe: any; // optional

  constructor(
    public _platform: Platform,
    private _element: ElementRef,
    private _componentResolver: ComponentFactoryResolver,
    private _viewContainerRef: ViewContainerRef,
  ) {}

  ngOnInit() {
    this.items.sort((a, b) => a[this.labelKey].localeCompare(b[this.labelKey]));
    this.updateSearchList();
    this.isIos = this._platform.is('ios');
  }

  private countAtChars(str: string, searchPattern: string, tagLeft: string, tagRight: string): number {
    const regularExpression = new RegExp(`${tagLeft}${searchPattern}${tagRight}`, 'g');
    const replacement = '';
    const filteredString = str.replace(regularExpression, replacement);
    const allAt: string = filteredString.replace(/[^@]/g,'');
    return allAt.split('').length;
  }

  private onInputChange(event) {
    if (!this.isIos) {
      const value = event.target.innerHTML;

      if (this.taskPageSaveEvent) {
        this.atCounterPrev = 0;
      }

      this.atCounterCurrent = this.countAtChars(value, '@', '<em>', '<\/em>');
    }
  }

  private androidKeyHandler(event) {
    if (!this.isIos) {
      this.keyHandler(event);
    }
  }

  private iosKeyHandler(event) {
    if (this.isIos) {
      this.keyHandler(event);
    }
  }

  public ngOnChanges(change: SimpleChanges) {
    if (change.taskPageSaveEvent && change.currentValue) {
      this.atCounterPrev = 0;
    }

    if (change.textareaValue && change.textareaValue.currentValue && !this.isIos && this.isSemaphore) {
      const value = change.textareaValue.currentValue;
      this.atCounterPrev = this.countAtChars(value, '@', '<em>', '<\/em>');
      this.isSemaphore = false;
    }
  }

  setIframe(iframe: HTMLIFrameElement) {
    this.iframe = iframe;
  }

  stopEvent(event: any) {
    if (!event.wasClick) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  }

  blurHandler(event: any) {
    this.stopEvent(event);
    this.stopSearch = true;
    if (this.searchList) {
      this.searchList.hidden = true;
    }
  }

  keyHandler(event: any, nativeElement: HTMLInputElement = this._element.nativeElement) {
    let val: string = getValue(nativeElement);
    let pos = getCaretPosition(nativeElement, this.iframe);
    let charPressed = event.key;

    if (!charPressed) {
      let charCode = event.which || event.keyCode;
      if (!event.shiftKey && (charCode >= 65 && charCode <= 90)) {
        charPressed = String.fromCharCode(charCode + 32);
      }
      else if (event.shiftKey && charCode === KEY_2) {
        charPressed = this.triggerChar;
      }
      else {
        // TODO (dmacfarlane) fix this for non-alpha keys
        // http://stackoverflow.com/questions/2220196/how-to-decode-character-pressed-from-jquerys-keydowns-event-handler?lq=1
        charPressed = String.fromCharCode(event.which || event.keyCode);
      }
    }
    if (event.keyCode == KEY_ENTER && event.wasClick && pos < this.startPos) {
      // put caret back in position prior to contenteditable menu click
      pos = this.startNode.length;
      setCaretPosition(this.startNode, pos, this.iframe);
    }

    if (!this.isIos) {
      const isCharUnwanted = [ 'ArrowUp', 'ArrowDown', 'Enter', 'Shift' ].every(k => charPressed !== k);
      if (this.atCounterPrev < this.atCounterCurrent && this.atCounterCurrent !== 0 && isCharUnwanted && !this.isIos && event.keyCode !== 16) {
        this.atCounterPrev = this.atCounterCurrent;
        charPressed = '@';
      } else if (this.atCounterPrev > this.atCounterCurrent && this.atCounterCurrent !== 0 && isCharUnwanted && !this.isIos) {
        this.atCounterPrev = this.atCounterCurrent;
      } else if (this.atCounterPrev > this.atCounterCurrent && isCharUnwanted && !this.isIos) {
        this.atCounterPrev = 0;
        this.atCounterCurrent = 0;
      }
    }

    if (charPressed == this.triggerChar) {
      this.startPos = pos;
      this.startNode = (this.iframe ? this.iframe.contentWindow.getSelection() : window.getSelection()).anchorNode;
      this.stopSearch = false;
      this.searchString = '';
      this.showSearchList(nativeElement);
      this.updateSearchList();
    }
    else if (this.startPos >= 0 && !this.stopSearch) {
      if (pos <= this.startPos) {
        this.searchList.hidden = true;
      }
      // ignore shift when pressed alone, but not when used with another key
      else if (event.keyCode !== KEY_SHIFT &&
          !event.metaKey &&
          !event.altKey &&
          !event.ctrlKey &&
          pos > this.startPos
      ) {
        if (event.keyCode === KEY_BACKSPACE && pos > 0) {
          this.searchList.hidden = this.stopSearch;
          pos--;
        }
        else if (!this.searchList.hidden) {
          if (event.keyCode === KEY_TAB || event.keyCode === KEY_ENTER) {
            this.stopEvent(event);
            this.searchList.hidden = true;
            // value is inserted without a trailing space for consistency
            // between element types (div and iframe do not preserve the space)
            const textToEmit = insertValue(
              nativeElement,
              this.startPos,
              pos,
              this.mentionSelect(this.triggerChar + this.searchList.activeItem)
            );
            this.itemSelected.emit(textToEmit);
            // fire input event so angular bindings are updated
            if ("createEvent" in document) {
              var evt = document.createEvent("HTMLEvents");
              evt.initEvent("input", false, true);
              nativeElement.dispatchEvent(evt);
            }
            this.startPos = -1;
            this.searchString = '';
            this.itemSelected.emit(this.searchList.activeItem);
            return false;
          }
          else if (event.keyCode === KEY_ESCAPE) {
            this.stopEvent(event);
            this.searchList.hidden = true;
            this.stopSearch = true;
            return false;
          }
          else if (event.keyCode === KEY_DOWN) {
            this.stopEvent(event);
            this.searchList.activateNextItem();
            return false;
          }
          else if (event.keyCode === KEY_UP) {
            this.stopEvent(event);
            this.searchList.activatePreviousItem();
            return false;
          }
        }

        if (event.keyCode === KEY_LEFT || event.keyCode === KEY_RIGHT) {
          this.stopEvent(event);
          return false;
        }
        else {
          let mention = isInputOrTextAreaElement(nativeElement) ?
            val.substring(this.startPos + 1, pos) :
            getWindowSelection(this.iframe).anchorNode.nodeValue.substring(this.startPos + 1, pos);
          if (event.keyCode !== KEY_BACKSPACE) {
            mention += charPressed;
          }
          this.searchString = mention;
          this.searchTerm.emit(this.searchString);
          this.updateSearchList();
        }
      }
    }
  }

  updateSearchList() {
    let objects;
    if (this.items) {
      objects = this.items;
      // disabling the search relies on the async operation to do the filtering
      if (!this.disableSearch && this.searchString) {
        const searchStringLowerCase = this.searchString.toLowerCase();
        objects = this.items.filter(item => {
          const email = item.email.toLowerCase();
          return (item.name ? email + ' ' + item.name.toLowerCase() : email).includes(searchStringLowerCase);
        });
      }
    }
    // update the search list
    if (this.searchList) {
      this.searchList.items = objects;
      this.searchList.hidden = objects.length === 0;
    }

    if (this.searchList) {
      const numberOfItems = objects.length;
      const elementHeight = 50;
      const correction = 35;
      const taskPageCorrection = 20;
      const relativeTop: number = this._element.nativeElement.getBoundingClientRect().top;
      const carretPos = this.searchList.carretPosition;
      let calculatedPosition = carretPos - (numberOfItems * elementHeight) - relativeTop - correction;

      if (this.isTaskPage) {
        calculatedPosition += taskPageCorrection;
      }

      if (numberOfItems < 5 && this.searchList.isListPositionOver) {
         this.searchList._element.nativeElement.style.top = calculatedPosition + 'px';
      } else {
         this.searchList.position(this._element.nativeElement, this.iframe, this.viewHeight, this.isTaskPage);
      }
    }
  }

  private insertUsernameIntoTextarea(nativeElement: HTMLInputElement, textToInsert: string):void {
    const textToAdd = this.searchList.activeItem;
    const caretPos = getCaretPosition(nativeElement);
    const range = document.createRange();
    const startNode = nativeElement;
    const selObj = window.getSelection();

    range.setStart(selObj.focusNode, caretPos);
    range.setEnd(selObj.focusNode, caretPos);
    range.collapse(true);

    const spanElement = document.createElement('span');

    spanElement.innerHTML = `<b>${textToAdd}</b>&nbsp;`;
    range.insertNode(spanElement);
    selObj.removeAllRanges();
    selObj.addRange(range);
    startNode.focus();

    if (window.getSelection) {
      if (window.getSelection().empty) {  // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {  // Firefox
        window.getSelection().removeAllRanges();
      }
    }

    this.itemSelected.emit(textToAdd);
  }

  showSearchList(nativeElement: HTMLInputElement) {
    if (this.searchList == null) {
      let componentFactory = this._componentResolver.resolveComponentFactory(MentionListComponent);
      let componentRef = this._viewContainerRef.createComponent(componentFactory);
      this.searchList = componentRef.instance;
      this.searchList.position(nativeElement, this.iframe, this.viewHeight, this.isTaskPage);
      componentRef.instance['itemClick'].subscribe((item) => {
        nativeElement.focus();
        let fakeKeydown = {"keyCode": KEY_ENTER, "wasClick": true};
        if (!this.isIos) {
          this.insertUsernameIntoTextarea(nativeElement, item.target.innerText);
        }
        this.keyHandler(fakeKeydown, nativeElement);
      });
    }
    else {
      this.searchList.activeIndex = 0;
      this.searchList.position(nativeElement, this.iframe, this.viewHeight, this.isTaskPage);
      window.setTimeout(() => this.searchList.resetScroll());
    }
  }
}
