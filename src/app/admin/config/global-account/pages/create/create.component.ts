import { Helpers } from './../../../../../helpers';
import { Subscription } from 'rxjs';
import { CommonValidator } from './../../../../../shared/custom-validator/common.validator';
import { Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlobalAccountService } from '../../service/global-account.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    if (this.subAddAccount)
      this.subAddAccount.unsubscribe();
    if (this.subFindAccount)
      this.subFindAccount.unsubscribe();
  }

  globalAccountForm: FormGroup;
  response = {
    isSubmitting: false,
    isSuccess: false,
    message: ''
  };


  private subFindAccount: Subscription;
  private subAddAccount: Subscription;

  constructor(private fb: FormBuilder,
    private globalAccountService: GlobalAccountService) {
    this.globalAccountForm = this.fb.group({
      name: ['', [Validators.required, CommonValidator.notEmpty]],
      pass: ['', [Validators.required, CommonValidator.notEmpty]],
      baseUrl: ['', [Validators.required, CommonValidator.notEmpty]]
    })
  }

  ngOnInit() {
    Helpers.setLoading(true)
    this.subFindAccount = this.globalAccountService.find()
      .subscribe(response => {
        this.name.setValue(response.name);
        this.pass.setValue(response.pass);
        this.baseUrl.setValue(response.baseUrl);
        Helpers.setLoading(false);
      }, error => {
        Helpers.setLoading(false);
      })
  }

  onSubmit() {
    Helpers.setLoading(true);
    this.response.isSubmitting = false;
    if (this.globalAccountForm.valid) {
      this.subAddAccount = this.globalAccountService.add(this.globalAccountForm.value)
        .subscribe(response => {
          Helpers.setLoading(false);
          this.response.isSubmitting = false;
          this.response.isSuccess = true;
          this.response.message = "This account has been editted successful";
        }, error => {
          Helpers.setLoading(false);
          this.response.isSubmitting = false;
          this.response.isSuccess = true;
          this.response.message = "Sorry, server is not responding";
          ;
        })
    }
  }

  onResetResponse() {
    this.response = {
      isSubmitting: false,
      isSuccess: false,
      message: ''
    };
  }

  get name() {
    return this.globalAccountForm.get('name');
  }
  get pass() {
    return this.globalAccountForm.get('pass');
  }
  get baseUrl() {
    return this.globalAccountForm.get('baseUrl');
  }
}
