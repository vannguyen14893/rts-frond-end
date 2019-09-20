import { AbstractControl, ValidatorFn } from "@angular/forms";
import Utils from "../helpers/util";

export function validateDeadline(control: AbstractControl) {
  let deadline: Date;
  let today: Date;
  if (control.value) {
    deadline = Utils.createDate(control.value.year, control.value.month, control.value.day);
    today = new Date();
    return (deadline > today) ? null : { minDate: true };
  }
  return null;
}