export function parseCreatedAtToText(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const m = Math.floor(minutes % 60);
  const h = Math.floor(minutes / 60);
  const d = Math.floor(h / 24);

  if (seconds < 60) {
    return 'a few seconds ago';
  }

  if (d === 1) {
    return `one day ago`;
  } else if (d > 1) {
    return `${d} days ago`;
  }

  if (h === 0 && m > 0) {
    return `${String(m)}min. ago`;
  }

  if (h > 0 && m === 0) {
    return `${String(h)}h ago`;
  }

  if (h > 0 && m > 0) {
    return `${String(h)}h ${String(m)}min. ago`;
  }
}
