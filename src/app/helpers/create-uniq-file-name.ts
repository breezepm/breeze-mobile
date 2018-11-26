export function createUniqFileName(currentName: string = ''): string {
  const name = Date.now();
  const [ extension ] = currentName.split('.').slice(-1);
  return `${name}.${extension}`;
}
