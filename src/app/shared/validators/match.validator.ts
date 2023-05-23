import { Directive, Input } from '@angular/core';
import { Validator, AbstractControl, FormGroup, NG_VALIDATORS, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appMatch]',
  standalone: true,
  providers: [{provide: NG_VALIDATORS, useExisting: MatchValidator, multi: true}]
})
export class MatchValidator implements Validator {
  @Input('appMatch') names!: string;

  constructor() { }

  validate(group: AbstractControl): ValidationErrors | null {
    if (group instanceof FormGroup) {
      const names = this.names.split(',');
      const val = group.value[names[0]];
      if (!names.every(name => group.value[name] === val)) {
        return { 'match': true };
      }
    }

    return null; // No errors
  }
}
