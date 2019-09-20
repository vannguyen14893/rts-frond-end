import { ValidationErrors } from "@angular/forms/src/directives/validators";
import { AbstractControl } from "@angular/forms/src/model";

export class ChangePasswordValidators {
    static matchPassword(control: AbstractControl): ValidationErrors {
        const password = control.get('newPassword') ? control.get('newPassword').value : '';
        const confirmPassword = control.get('newPasswordConfirmation') ? control.get('newPasswordConfirmation').value : '';
        if (password !== confirmPassword && control.get('newPasswordConfirmation').value) {
            control.get('newPasswordConfirmation').setErrors({ matchpassword: true });
        } else {
            return null;
        }
    }

    static duplicateCurrentPassword(control: AbstractControl): ValidationErrors {
        const currentPassword = control.get('currentPassword') ? control.get('currentPassword').value : '';
        const newPassword = control.get('newPassword') ? control.get('newPassword').value : '';
        if (currentPassword === newPassword && (control.get('currentPassword').value as string || '').length >= 8) {
            control.get('newPassword').setErrors({ duplicateCurrentPassword: true });
        } else {
            return null;
        }
    }
}
