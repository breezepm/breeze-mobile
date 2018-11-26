import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'hourMinFormat' })
export class HourMinuteFormatPipe implements PipeTransform {

  public transform(minutes = 0): string {
    const m = Math.floor(minutes % 60);
    const h = Math.floor(minutes / 60);

    if (h === 0 && m > 0) {
      return `${String(m)}m`;
    }

    if (h > 0 && m === 0) {
      return `${String(h)}h`;
    }

    if (h > 0 && m > 0) {
      return `${String(h)}h${String(m)}m`;
    }

    return '0';
  }

}
