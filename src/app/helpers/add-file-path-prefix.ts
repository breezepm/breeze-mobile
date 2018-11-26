import { contains } from 'ramda';

export function addFilePathPrefix(path: string): string {
  const ROOT = 'file://';
  return contains(ROOT, path) ? path : ROOT + path;
}
