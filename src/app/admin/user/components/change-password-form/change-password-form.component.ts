import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChangePasswordValidators } from './change-password.validators';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { timer } from 'rxjs/observable/timer';
import { Subscription } from 'rxjs/Subscription';
import { Helpers } from '../../../../helpers';
import { take, map } from 'rxjs/operators';
import { IdentityService } from '../../../../core/services/identity.service';
import { NavigationService } from '../../../../core/services/navigation.service';


@Component({
  selector: 'app-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.css']
})
export class ChangePasswordFormComponent implements OnInit, OnDestroy {
  // tslint:disable-next-line:max-line-length
  globalBodyClass = 'm-page--loading-non-block m-page--fluid m--skin- m-content--skin-light2 m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default';

  form: FormGroup;
  data: {}; // store form data
  baseResponse = {
    responseStatus: 0,
    responseCode: '',
    message: ''
  }; // store API response
  resultMessage: Message = null; // store message when succeed to change pass

  timer = 4; // countdown
  subTimer: Subscription;
  subChangePass: Subscription;
  constructor(
    private userService: UserService,
    private identityService: IdentityService,
    private navigationService: NavigationService
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = new FormGroup({
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(32)
      ]),
      newPasswordConfirmation: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(32)
      ])
    }, {
        validators: [
          ChangePasswordValidators.matchPassword,
          ChangePasswordValidators.duplicateCurrentPassword
        ]
      });
  }

  onSubmit() {
    // Clear message if exists
    this.resultMessage = null;

    Helpers.setLoading(true);
    Helpers.bodyClass(this.globalBodyClass);

    if (this.form.valid) {
      this.data = {
        password: this.currentPassword.value,
        newPassword: this.newPassword.value,
      };
      this.subChangePass = this.userService.changePassword(this.data).subscribe(response => {
        Helpers.setLoading(false);
        this.baseResponse = response;
        if (this.baseResponse.responseStatus === 0) {
          this.resultMessage = {
            hasError: true,
            message: 'Incorrect current password.'
          };
        } else if (this.baseResponse.responseStatus === 200) {
          this.resultMessage = {
            hasError: false,
            message: 'Password changed. Logging you out in ' // Do NOT delete the trailing space.
          };
          this.form.reset();
          this.subTimer = timer(0, 1000).pipe(
            take(this.timer),
            map( () => {
              --this.timer;
            })
          ).subscribe( () => {
            console.log(this.timer);
            if (this.timer === 0) {
              this.identityService.removeIdentity();
              this.navigationService.navLogin();
            }
         });
        } else if (this.baseResponse.responseStatus === 400) {
          this.resultMessage = {
            hasError: true,
            message: 'Session timeout! Please logout and login again.'
          };
        }
      }, (err: HttpErrorResponse) => {
        Helpers.setLoading(false);
        this.resultMessage = {
          hasError: true,
          message: 'Something went wrong. Please try again later.'
        };
      });
    } else {
      Helpers.setLoading(false);
      this.resultMessage = {
        hasError: true,
        message: 'Make sure you have entered correct information.'
      };
    }
  }

  onReset() {
    this.resultMessage = null;
    this.form.reset();
  }

  get currentPassword() {
    return this.form.get('currentPassword');
  }

  get newPassword() {
    return this.form.get('newPassword');
  }

  get newPasswordConfirmation() {
    return this.form.get('newPasswordConfirmation');
  }

  ngOnDestroy() {
    if (this.subChangePass) {
      this.subChangePass.unsubscribe();
    }
    if (this.subTimer) {
      this.subTimer.unsubscribe();
    }
  }

}

interface Message {
  hasError: boolean;
  message: string;
}
