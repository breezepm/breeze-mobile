import { ViewContainerRef } from '@angular/core';
// DOM element manipulation functions...
//

export function insertValue(nativeElement: HTMLInputElement, start: number, end: number, textToInsert: string): string {
  const textToAdd = textToInsert;
  const caretPos = getCaretPosition(nativeElement);
  const range = document.createRange();
  const deleteRange = document.createRange();
  const startNode = nativeElement;
  const selObj = window.getSelection();

  let position = 0;

  if (selObj && selObj.rangeCount > 0) {
    const selRange = selObj.getRangeAt(0);
    position = selRange.startOffset;
  }

  range.setStart(selObj.focusNode, caretPos);
  range.setEnd(selObj.focusNode, caretPos);
  range.collapse(true);

  deleteRange.setStart(selObj.focusNode, position - (end - start));
  deleteRange.setEnd(selObj.focusNode, caretPos);
  deleteRange.deleteContents();

  let textNotEmail;
  const spanElement = document.createElement('span');

  if (textToAdd.includes('@')) {
    spanElement.innerHTML = `<b>${textToAdd}</b>&nbsp;`;
  } else {
    textNotEmail = document.createTextNode(textToAdd);
    spanElement.appendChild(textNotEmail);
  }
  range.insertNode(spanElement);
  selObj.removeAllRanges();
  selObj.addRange(range);
  startNode.focus();

  selObj.removeAllRanges();

  return textToAdd;
}

function setValue(el: any, value: any) {
  if (isInputOrTextAreaElement(el)) {
    el.value = value;
  }
  else {
    el.textContent = value;
  }
}

export function getValue(el: HTMLInputElement) {
  return isInputOrTextAreaElement(el) ? el.value : el.textContent;
}

export function isInputOrTextAreaElement(el: HTMLElement): boolean {
  return el != null && (el.nodeName == 'INPUT' || el.nodeName == 'TEXTAREA');
}
export function isTextElement(el: HTMLElement): boolean {
  return el != null &&
    (el.nodeName == 'INPUT' || el.nodeName == 'TEXTAREA' || el.nodeName == '#text');
}
export function setCaretPosition(el: HTMLInputElement, pos: number, iframe: HTMLIFrameElement = null) {
  if (isInputOrTextAreaElement(el) && el.selectionStart) {
    el.focus();
    el.setSelectionRange(pos, pos);
  }
  else {
    let range = getDocument(iframe).createRange();
    range.setStart(el, pos);
    range.collapse(true);
    let sel = getWindowSelection(iframe);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

export function getCaretPosition(el: HTMLInputElement, iframe: HTMLIFrameElement = null) {
  if (isInputOrTextAreaElement(el)) {
    var val = el.value;
    return val.slice(0, el.selectionStart).length;
  }
  else {
    var selObj = getWindowSelection(iframe);
    if (selObj.rangeCount>0) {
      var selRange = selObj.getRangeAt(0);
      var position = selRange.startOffset;
      return position;
    }
  }
}

// Based on ment.io functions...
//

function getDocument(iframe: HTMLIFrameElement) {
  if (!iframe) {
    return document;
  } else {
    return iframe.contentWindow.document;
  }
}

export function getWindowSelection(iframe: HTMLIFrameElement): Selection {
  if (!iframe) {
    return window.getSelection();
  } else {
    return iframe.contentWindow.getSelection();
  }
}

export function getContentEditableCaretCoords(ctx: { iframe: HTMLIFrameElement, parent?: Element }) {
  let markerTextChar = '\ufeff';
  let markerId = 'sel_' + new Date().getTime() + '_' + Math.random().toString().substr(2);
  let doc = getDocument(ctx ? ctx.iframe : null);
  let sel = getWindowSelection(ctx ? ctx.iframe : null);
  let prevRange = sel.getRangeAt(0);

  // create new range and set postion using prevRange
  let range = doc.createRange();
  range.setStart(sel.anchorNode, prevRange.startOffset);
  range.setEnd(sel.anchorNode, prevRange.startOffset);
  range.collapse(false);

  // Create the marker element containing a single invisible character
  // using DOM methods and insert it at the position in the range
  let markerEl = doc.createElement('span');
  markerEl.id = markerId;
  markerEl.appendChild(doc.createTextNode(markerTextChar));
  range.insertNode(markerEl);
  sel.removeAllRanges();
  sel.addRange(prevRange);

  let coordinates = {
    left: 0,
    top: markerEl.offsetHeight
  };

  localToRelativeCoordinates(ctx, markerEl, coordinates);

  markerEl.parentNode.removeChild(markerEl);
  return coordinates;
}

function localToRelativeCoordinates(
  ctx: { iframe: HTMLIFrameElement, parent?: Element },
  element: Element,
  coordinates: { top: number; left: number }
) {
  let obj = <HTMLElement>element;
  let iframe = ctx ? ctx.iframe : null;
  while (obj) {
    if (ctx.parent != null && ctx.parent == obj) {
      break;
    }
    coordinates.left += obj.offsetLeft + obj.clientLeft;
    coordinates.top += obj.offsetTop + obj.clientTop;
    obj = <HTMLElement>obj.offsetParent;
    if (!obj && iframe) {
      obj = iframe;
      iframe = null;
    }
  }
  obj = <HTMLElement>element;
  iframe = ctx ? ctx.iframe : null;
  while (obj !== getDocument(null).body && obj != null) {
    if (ctx.parent != null && ctx.parent == obj) {
      break;
    }
    if (obj.scrollTop && obj.scrollTop > 0) {
      coordinates.top -= obj.scrollTop;
    }
    if (obj.scrollLeft && obj.scrollLeft > 0) {
      coordinates.left -= obj.scrollLeft;
    }
    obj = <HTMLElement>obj.parentNode;
    if (!obj && iframe) {
      obj = iframe;
      iframe = null;
    }
  }
}

export function camelize(str) {
  return str
    .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
    .replace(/\s/g, '');
}
