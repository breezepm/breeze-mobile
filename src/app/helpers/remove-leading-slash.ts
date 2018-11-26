export function removeLeadingSlash(url: string = ''): string {
  return url.replace(/^\/+/, '');
}
