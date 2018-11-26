import { Pipe, PipeTransform } from '@angular/core';
import { contains, mapObjIndexed, filter, where } from 'ramda';

const toLowerCase = value => typeof value === 'string' ? value.toLowerCase() : value;
const equalValues = value => toEqual => contains(toLowerCase(value))(toLowerCase(toEqual));
const whereContent = filterObj => mapObjIndexed((value) => equalValues(value), filterObj);
const filterFunction = (filterObj, myArr) => filter(where(whereContent(filterObj)))(myArr);

/**
 * @param array - takes array of objects e.g [{ id: 0, search_name: 'foo' }, { id: 1, search_name: 'bar' }]
 * @param filterObj - takes object filter, e.g. { search_name: 'foo' }
 * returns array of objects matching given filterObj e.g. [{ id: 0, search_name: 'foo' }]
 */
@Pipe({ name: 'filterByProp' })
export class FilterByPropPipe implements PipeTransform {

  public transform(array: any[] = [], filterObj: any = {}): any {
    return filterFunction(filterObj, array);
  }

}
