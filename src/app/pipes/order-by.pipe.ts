import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterByAssignment' })
export class FilterByAssignmentPipe implements PipeTransform {

  public transform(array: any[] = [], prop: string): any {
    return array.sort((a: any, b: any) => (a[prop] && !b[prop]) ? -1 : 1);
  }

}
