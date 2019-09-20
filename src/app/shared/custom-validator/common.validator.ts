import { AbstractControl, ValidatorFn } from "@angular/forms";

export class CommonValidator {

  static notEmpty(control: AbstractControl) {
    let value: string;
    if (control.value) {
      value = control.value;
      return (value.trim() === '') ? { notEmpty: 'Title is required.' } : null;
    }
    return { notEmpty: 'Title is required.' };
  }

  /**
* WhatItDoes validates min length of an input excluding preceeding and trailing spaces.
* @param minLength - the minimum length required by the input.
* CreatedBy ldthien
* CreatedAt 2018/04/02
*/
  static minlength(minLength: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const value = (control.value || '').trim();
      if (minLength > 0) {
        if (value.length > 0 && value.length < minLength) {
          return { minlength: true };
        }
      }
      return null;
    };
  }

  /**
  * WhatItDoes validates email format according to RFC 2822 Standard.
  * @param minLength - the min length of the input [trimmed] to activate this validator.
  * CreatedBy ldthien
  * CreatedAt 2018/04/02
  */
  static validateEmailFormat(minLength?: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const value: String = control.value.toString().trim();
      // Email Regex complying with RFC 2822 STANDARD
      // tslint:disable-next-line:max-line-length
      const regex = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/;
      if (!minLength) {
        minLength = 1;
      }
      if (value && value.length >= minLength) {
        if (!regex.test(value.toLowerCase())) {
          return { invalidFormat: true };
        }
      }
    };
  }

  /**
  * WhatItDoes validates required input field (trim spaces).
  * Same functionality with notEmpty.
  * But purpose is to override Angular Validators.required.
  * CreatedBy ldthien
  * CreatedAt 2018/04/06
  */
  static required(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if ( !control.value || control.value.toString().trim() === '') {
        return { required: true };
      }
      return null;
    };
  }

  /**
  * WhatItDoes validates username against specified regex.
  * Username should contain letter and number only.
  *
  * @param minLength - the min length of username if specified.
  * This means this validator is activated only when username reaches this min length.
  * CreatedBy ldthien
  * CreatedAt 2018/04/06
  */
  static validateUsername(minLength?: number) {
    if (!minLength) {
      minLength = 1;
    }
    return (control: AbstractControl): { [key: string]: any } => {
      const value = String(control.value).trim();
      const regex: RegExp = new RegExp(/^[a-z0-9]*$/i);
      if (value.length >= minLength && !value.match(regex)) {
        return { invalidFormat: true };
      }
      return null;
    };
  }

  /**
  * WhatItDoes validates input against specified regex pattern.
  *
  * @param minLength - the min length of input if specified.
  * This means the validator is activated only when input reaches this min length.
  * CreatedBy ldthien
  * CreatedAt 2018/04/06
  */
  static pattern(pattern: RegExp, minLength?: number) {
    if (!minLength) {
      minLength = 1;
    }
    return (control: AbstractControl): { [key: string]: any} => {
      const value = String(control.value || '').trim();
      if (value.length >= minLength && !value.match(pattern)) {
        return { invalidFormat: true };
      }
      return null;
    };
  }
}
