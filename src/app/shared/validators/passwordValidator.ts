export function validatePassword(password: string) {
  let validPassword = /^(?=.*[!@#$%&/.()=+?\\[\\]~\\-^0-9])[a-zA-Z0-9!@#$%&./()=+?\\[\\]~\\-^]{8,}$/;
  if (validPassword.test(password)) {
    return true;
  } else {
    return false;
  }
}
