export function sliceUpToLastSlash(path: string = ''): string {
  return path.substr(0, path.lastIndexOf('/') + 1);
}
