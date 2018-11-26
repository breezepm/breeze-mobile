import { either, propEq, contains } from 'ramda';

const CANCEL_CODE = 3;

let didUserCancel: (err: string|{ code: number }) => boolean;

const isCancelled = either(propEq('code', CANCEL_CODE), contains('cancelled'));

didUserCancel = either(isCancelled, contains('has no access to assets'));

export { didUserCancel };
