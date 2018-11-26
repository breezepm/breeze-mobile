import { anyPass, complement, equals, isEmpty, isNil, where } from 'ramda';

export const propIsDefinedAndNotEmpty = propName =>
  where({
    [propName]: complement(anyPass([isNil, isEmpty, equals(0)])),
  });
