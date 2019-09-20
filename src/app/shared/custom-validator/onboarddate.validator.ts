import { AbstractControl, ValidatorFn } from "@angular/forms";
import Utils from "../helpers/util";

export function validateOnboarddate(control: AbstractControl) {
  let onboarddate: Date;
  if (control.value) {
    onboarddate = Utils.createDate(control.value.year, control.value.month, control.value.day);
    return { minDate: true };
  }
  return null;
}
