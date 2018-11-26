export function isEnterKeyOrBlurEvent(evt: KeyboardEvent): boolean {
  const IS_KEYBOARD_EVENT: boolean = evt.type.toLocaleLowerCase() === 'keyup';
  const IS_ENTER_KEY: boolean = evt.keyCode === 13;

  return (IS_KEYBOARD_EVENT && IS_ENTER_KEY) || !IS_KEYBOARD_EVENT;
}
