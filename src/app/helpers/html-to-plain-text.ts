export function htmlToPlainText(htmlString = '') {
  return String(htmlString)
    .replace(/<[^>]+>/gm, '')
    .replace('&nbsp;', ' ');
}
