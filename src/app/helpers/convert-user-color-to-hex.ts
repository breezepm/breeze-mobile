export function convertUserColorToHex(user: any) {
  return ({ ...user, color: '#' + user.color });
}
