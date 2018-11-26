import { pathOr, compose, split, toLower, join } from 'ramda';

/**
 * @param code The status code.
 * @param asShort A boolean indicating if the result should be in short notation, "onhold", "ready" etc.
 */
export function getTaskStatusName(code: number, asShort?: boolean): string {
  const statuses = {
    0: 'Status',
    1: 'Done',
    2: 'Blocked',
    3: 'On Hold',
    4: 'Ready',
  };

  const getName = pathOr('', [code]);
  const toShortVersion = compose(join(''), split(' '), toLower, getName);

  return asShort ? toShortVersion(statuses) : getName(statuses);
}

export function getTaskStatusCode(name: string): number {
  const statuses = {
    done: 1,
    blocked: 2,
    onhold: 3,
    ready: 4,
  };

  return pathOr(0, [name], statuses);
}
