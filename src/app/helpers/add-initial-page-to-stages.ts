import { assoc, evolve, map } from 'ramda';

export const addInitialPageToStages = map(evolve({ 'stages': map(assoc('page', 2)) }));
