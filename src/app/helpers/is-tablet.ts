export function isTablet(): boolean {
  const TABLET_SIZE = 767;
  return window.innerWidth > TABLET_SIZE;
}
