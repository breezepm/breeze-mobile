export function getFileNameFromXml(xmlStr: string): string {
  const urlBetweenKeyTags = /<Key>([\s\S]*?)<\/Key>/;
  const url = xmlStr.match(urlBetweenKeyTags)[1];
  const lastSlashIdx = url.lastIndexOf('/');
  const s3Name = url.slice(1 + lastSlashIdx);
  return s3Name;
}
