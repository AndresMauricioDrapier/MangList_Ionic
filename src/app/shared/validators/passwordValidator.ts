export function validatePassword(password: string) {
  let pattern = new RegExp(/^(?=.*[!@#$%&/.()=+?\\[\\]~\\-^0-9])[a-zA-Z0-9!@#$%&./()=+?\\[\\]~\\-^]{8,}$/);
  if (pattern.test(password)) {
    return true;
  }
  return false;
}
