function p8(s: boolean = false): string {
  const p = (Math.random().toString(16) + '000000000').substr(2, 8);
  return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
}

function guid(): string {
  return p8() + p8(true) + p8(true) + p8();
}

function uniqueId(length = 16): string {
  let id = '';

  while (id.length < length) {
    id += Math.random().toString(36).substr(2);
  }

  return id.substr(0, length);
}

export function generateS3Key(): string {
  return guid() + '/' + uniqueId() + '/';
}
