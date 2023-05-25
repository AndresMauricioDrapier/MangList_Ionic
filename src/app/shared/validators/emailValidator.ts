export function validateEmail(email: string) {
  let validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
  if (validEmail.test(email)) {
    return true;
  } else {
    return false;
  }
}
