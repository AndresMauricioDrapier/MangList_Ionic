import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function isTheSame(sameControl: FormControl): ValidatorFn {
  return (same: AbstractControl): ValidationErrors | null => {
    if (sameControl.value !== same.value) {
      return { isTheSame: true };
    }

    return null;
  };
}
