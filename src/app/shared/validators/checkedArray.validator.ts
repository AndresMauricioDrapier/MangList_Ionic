import { AbstractControl, FormArray, ValidatorFn } from '@angular/forms';

export function oneChecked(): ValidatorFn {
  return (array: AbstractControl): { [key: string]: boolean } | null => {
    const arrayForm = array as FormArray;
    if (arrayForm.value.every((v: boolean) => v === false)) {
      return { oneChecked: true };
    }

    return null;
  };
}
