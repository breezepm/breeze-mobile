import { Refresher } from 'ionic-angular';
import { curry } from 'ramda';
import { isDefined } from './path-is-defined';

export const completeRefresherOnError = curry((killerSubject$, refresher$, inputStream) =>
  inputStream
    .takeUntil(killerSubject$)
    .filter(Boolean)
    .withLatestFrom(refresher$, (_, refresher) => refresher)
    .filter(isDefined)
    .do((refresher: Refresher) => refresher.complete())
);
