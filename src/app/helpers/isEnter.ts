export function isEnter(event: KeyboardEvent) {
  const KEYBOARD_ENTER_KEY = 13;
  return event.keyCode === KEYBOARD_ENTER_KEY;
}