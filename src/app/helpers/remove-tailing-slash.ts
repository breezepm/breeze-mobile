export function removeTailingSlash(url: string = ''): string {
  return url.replace(/\/+$/, '');
}
