import { environment } from './../../../../environments/environment';
import { LocalStorageService } from './../../../core/services/local-storage.service';
import { IdentityService } from '../../../core/services/identity.service';
import { LOCAL_STORAGE } from './../../../shared/constants/local-storage.constant';
import { ResetPasswordService } from './../../services/reset-password.service';
import { LoginService } from './../../services/login.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { Role } from '../../../model/role.class';
import { Response } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormGroupDirective } from '@angular/forms';
import 'rxjs/add/operator/switchMap';
import { User } from '../../../model/user.class';
import { Token } from '../../../model/token.class';
import { IRootState } from './../../../core/redux/root.store';
import { NgRedux } from 'ng2-redux';
import { LOGOUT } from '../../../core/redux/root.action';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  message = ''; // display the error message
  loading = false; // show/hide the loading icon of the login button
  constraints = {
    username: {
      maxlength: 50,
    },
    password: {
      maxlength: 50,
    }
  };

  private redirect: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navigationService: NavigationService,
    private loginService: LoginService,
    private resetService: ResetPasswordService,
    private identityService: IdentityService,
    private localStorageService: LocalStorageService,
    private ngRedux: NgRedux<IRootState>,
  ) {
    if (this.identityService.isLoggedIn()) {
      this.navigationService.navHomepage();
    }
  }

  loginForm = (new FormBuilder()).group({
    username: [''],
    password: ['']
  });

  get username() {
    return this.loginForm.get('username');
  }
  get password() {
    return this.loginForm.get('password');
  }

  ngOnInit() {
    const query = this.route.snapshot.queryParamMap;

    const autoLogin = query.get('auto_login') === 'true' ? true : false;
  }
  clearReduxStore() {
    this.ngRedux.dispatch({
      type: LOGOUT,
      payload: null,
    });
  }
  login(auto?: boolean) {
    this.clearReduxStore();
    this.loading = true;
    this.message = '';
    const query = this.route.snapshot.queryParamMap;
    const userInput = this.loginForm.value;
    const user = new User();
    user.username = userInput.username;
    user.password = this.password.value;

    this.loginService.login(user).switchMap((tokens: Response) => {
      this.localStorageService.setItem(LOCAL_STORAGE.TOKENS, JSON.stringify(tokens.json()));

      return this.loginService.getCurrentUser();
    }).subscribe((users: User[]) => {
      this.localStorageService.setItem(LOCAL_STORAGE.CURRENT_USER, JSON.stringify(users[0]));
      // Hide the loading icon
      this.loading = false;
      // Reset currentUser in IdentityService
      this.identityService.initializeCurrentUser();
      // navigate to homepage of current user
      this.navigationService.navHomepage();
    }, (e: Response) => {
      this.loading = false;
      if (e.status === 400) {
        this.message = 'Wrong username or password';
      } else {
        this.message = 'Problem occurs. Please try again later';
      }
    });
  }
  navForgotPassword() {
    this.navigationService.navForgotPassword();
  }


  displaySignInForm() {
    const login = $('#m_login');
    login.removeClass('m-login--forget-password');
    login.removeClass('m-login--signup');
    // try {
    //     $('form').data('validator').resetForm();
    // } catch (e) {
    // }

    login.addClass('m-login--signin');
    (<any>login.find('.m-login__signin')).animateClass('flipInX animated');
  }

  displayForgetPasswordForm() {
    const login = $('#m_login');
    login.removeClass('m-login--signin');
    login.removeClass('m-login--signup');

    login.addClass('m-login--forget-password');
    (<any>login.find('.m-login__forget-password')).animateClass('flipInX animated');
  }

  /**
  * WhatItDoes auto set values for username and password fields.
  * This is for demo purpose only.
  * CreatedBy ldthien
  * CreatedAt 2018/04/11
  */
  initForm(username: HTMLLinkElement) {
    this.username.setValue(username.innerText.trim());
    this.password.setValue('12345678');
  }

}
