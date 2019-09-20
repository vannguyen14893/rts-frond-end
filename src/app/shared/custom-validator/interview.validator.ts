import { AbstractControl, ValidatorFn } from '@angular/forms';
import Utils from '../helpers/util';

export class InterviewValidator {
  static minDate(control: AbstractControl) {
    let deadline: Date;
    let today: Date;
    if (control.value.toString().trim() || control.value.toString().trim() !== '') {
      deadline = Utils.createDate(control.value.year, control.value.month, control.value.day);
      today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
      return (deadline >= today) ? null : { minDate: true };
    }
    return null;
  }

}
