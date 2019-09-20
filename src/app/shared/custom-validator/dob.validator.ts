import { AbstractControl, ValidatorFn } from '@angular/forms';
import Utils from '../helpers/util';

export function validateDob(control: AbstractControl) {
  let dob: Date;
  let today: Date;
  if (control.value) {
    dob = Utils.createDate(control.value.year, control.value.month, control.value.day);
    today = new Date();
    return (dob <= today) ? null : { minDate: true };
  }
  return true;
}
