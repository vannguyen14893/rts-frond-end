import { NavigationService } from '../../../core/services/navigation.service';
import { ResetPasswordService } from './../../services/reset-password.service';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { timeout } from 'q';
// import { setTimeout } from 'timers';

@Component({
  selector: 'app-forgot-password-form',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordFormComponent implements OnInit {
  loading = false;
  form: FormGroup;

  response: any;
  error: any;
  message = '';

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter an email' :
      '';
  }
  constructor(
    private router: Router,
    private resetService: ResetPasswordService,
    private navigationService: NavigationService
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  get email() {
    return this.form.get('email');
  }

  resetPassword() {
    this.message = '';
    this.loading = true;
    if (this.error) {
      this.error = null;
    }
    this.resetService.resetPassword(this.email.value).subscribe(res => {
      this.response = res;
      this.loading = false;
      if (this.response && this.response.responseCode === "SUCCESS") {
        this.message = 'We have just sent a new password to your email. Please check it. Redirecting to login...'
        setTimeout(() => {
          this.displaySignInForm();
        }, 5000);
      } else {
        this.message = this.response.message;
      }

    }, ((error: HttpErrorResponse) => this.message = error.message));
  }
  initResetPassForm(demoEmail: HTMLLinkElement) {
    this.email.setValue(demoEmail.innerText);
  }

  displaySignInForm() {
    let login = $('#m_login');
    login.removeClass('m-login--forget-password');
    login.removeClass('m-login--signup');
    // try {
    //     $('form').data('validator').resetForm();
    // } catch (e) {
    // }

    login.addClass('m-login--signin');
    (<any>login.find('.m-login__signin')).animateClass('flipInX animated');
  }
}
