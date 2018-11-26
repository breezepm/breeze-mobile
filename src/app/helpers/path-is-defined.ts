import { compose, not, isNil, path, complement } from 'ramda';

export const isDefined: <S>(val: S) => boolean = complement(isNil);

export const pathIsDefined: <T>(route: string[], val: T) => boolean = compose(isDefined, path);
