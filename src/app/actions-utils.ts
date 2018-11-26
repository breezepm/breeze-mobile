import { Action } from '@ngrx/store';
/**
 * This function coerces a string into a string literal type.
 * Using tagged union types in TypeScript 2.0, this enables
 * powerful typechecking of our reducers.
 *
 * Since every action label passes through this function it
 * is a good place to ensure all of our action labels
 * are unique.
 */

const typeCache: { [label: string]: boolean } = {};
export function type<T>(label: T | ''): T {
  if (typeCache[<string> label]) {
    throw new Error(`Action type "${label}" is not unique`);
  }

  typeCache[<string> label] = true;

  return <T> label;
}

export function updateState<T, U>(target: T, attr: keyof T, source: U) {
  return <T> Object.assign({}, target, { [attr]: source });
}

export type Reducer<S, A> = (state: S, action: A) => S;

export function actionsDispatcher <P, A extends Action>(actionType: string) {
  return (payload?: P): A => {
    return <A> { type: actionType, payload };
  };
}
