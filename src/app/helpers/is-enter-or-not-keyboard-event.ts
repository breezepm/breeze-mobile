import { either, not, pipe, propEq } from 'ramda';

const isNotKeyboardEvent = pipe(propEq('type', 'keyup'), not);
const isEnterKey = propEq('keyCode', 13);

export const isEnterOrNotKeyboardEvent = either(isNotKeyboardEvent, isEnterKey);
