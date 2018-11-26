import { contains } from 'ramda';

export function contentTypeFromExtension(fileName: string): string {
  const [ extension ] = fileName.split('.').slice(-1);

  const supportedTypes = {
    image: [ 'bpm', 'gif', 'jpeg', 'jpg', 'png', 'webp' ],
    video: [ '3gp', '3gpp', 'mov', 'mp4', 'mkv', 'ogg', 'quicktime', 'webm' ],
  };

  const containsExtension = contains<string>(extension);

  if (containsExtension(supportedTypes.image)) {
    return `image/${extension}`;
  }

  if (containsExtension(supportedTypes.video)) {
    return `video/${extension}`;
  }

  return 'application/octet-stream';
}
