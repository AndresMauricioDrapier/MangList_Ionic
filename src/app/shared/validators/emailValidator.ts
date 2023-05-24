export function validateEmail(mail: string) {
  let pattern = new RegExp(/^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/);
  if (pattern.test(mail)) {
    return true;
  }
  return false;
}
