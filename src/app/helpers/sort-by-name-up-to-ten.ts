import { compose, filter, prop, sortBy, take, toLower } from 'ramda';

const sortByName = sortBy(compose(toLower, prop('name')));
const takeTen = take(10);
const filterUnassigned = filter(prop('assigned'));
export const sortByNameUpToTen: (arr: any[]) => any[] = compose(takeTen, sortByName, filterUnassigned);
