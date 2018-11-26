import { compose, prop, reverse, sortBy } from 'ramda';

const sortByDate = sortBy(prop('created_at'));
export const sortByDateDesc: <T>(arr: T[]) => T[] = compose(reverse, sortByDate);
