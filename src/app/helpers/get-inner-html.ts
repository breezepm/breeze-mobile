import { ElementRef } from '@angular/core';
import { compose, trim, pathOr } from 'ramda';

export const getInnerHtml = compose<ElementRef, string, string>(trim, pathOr('', ['nativeElement', 'innerHTML']));
