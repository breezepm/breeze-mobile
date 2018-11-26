import { map, when, propEq, toPairs, allPass, curry } from 'ramda';

/**
 *
 * @param propsEqObj The keys are the properties that we want to compare with the respective values.
 * @param mappingFn the mapping function case the condition matches for each property.
 * @example
 * const person = [
 *   { name: 'Person A', age: 10, city: 'City A' },
 *   { name: 'Person B', age: 10, city: 'City B' }
 * ];
 * mapwhenPropsEq({ age: 10, city: 'City A'}, evolve({ name: toLower }));
 * => { name: 'person a', age: 10, city: 'City A'}
 */
function mapWhenPropsEqual(propsEqObj, mappingFn) {
  const propsEq = map(([name, val]) => propEq(name, val), toPairs<string, any>(propsEqObj));
  return map(when(allPass(propsEq), mappingFn));
}

export const mapWhenPropsEq = curry(mapWhenPropsEqual);
