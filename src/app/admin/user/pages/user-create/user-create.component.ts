import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Department } from '../../../../model/department.class';
import { Role } from '../../../../model/role.class';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../../../../model/user.class';
import { UserService } from '../../services/user.service';
import { GetAllService } from '../../../../core/services/get-all.service';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../../../environments/environment.prod';
import { NavigationService } from '../../../../core/services/navigation.service';
import { timer } from 'rxjs/observable/timer';
import { take, map } from 'rxjs/operators';
import { Helpers } from '../../../../helpers';
import { CommonValidator } from '../../../../shared/custom-validator/common.validator';
import { REGEX } from '../../../../shared/constants/regex.constant';
import { Group } from '../../../../model/group';

declare var $: any;

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit, OnDestroy {

  // To enable loading icon
  globalBodyClass = 'm-page--loading-non-block m-page--fluid m--skin- m-content--skin-light2 m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default';

  inputConstraints = {
    varcharMaxLength: 255,
  };

  // To disable submit button and show loading icon
  loading = false;

  // To show error message after submitting form
  errorMessage = '';
  successMessage = '';
  timer = 4;
  // Pour into dropdown lists
  departments: Department[];
  roles: Role[];
  groups: Group[];

  // subscription
  subDepartment: Subscription;
  subRole: Subscription;
  subGroup: Subscription;
  subUsername: Subscription;
  subEmail: Subscription;
  subTimer: Subscription;

  // To view detail of duplicate username or email
  duplicateUsernameId: number;
  duplicateEmailId: number;

  form: FormGroup;

  constructor(
    private userService: UserService,
    private getAllService: GetAllService,
    private navigationService: NavigationService
  ) { }

  ngOnInit() {
    this.buildForm();
    this.subDepartment = this.getAllService.getAllDepartments().subscribe(departments => {
      this.departments = departments;
    });
    this.subRole = this.getAllService.getAllRoles().subscribe(roles => {
      this.roles = roles;
    });
    this.subGroup = this.getAllService.getAllGroups().subscribe(groups => {
      this.groups = groups;
    })
  }

  onSubmit() {
    // Disable submit button
    this.loading = true;
    // Reset the error message
    this.errorMessage = '';
    // Show loading
    Helpers.setLoading(true);
    Helpers.bodyClass(this.globalBodyClass);

    this.userService.addUser(this.getUserFromForm()).subscribe(res => {
      console.log(res);
      this.loading = false;
      Helpers.setLoading(false);
      this.form.reset();
      this.successMessage = 'User created! An email has been sent to the user.';
      this.subTimer = timer(0, 1000).pipe(
        take(this.timer),
        map( () => {
          --this.timer;
        })
      ).subscribe( () => {
        if (this.timer === 0) {
          this.navigationService.navUserList();
        }
     });
    }, err => {
      this.loading = false;
      if (err instanceof ErrorEvent) {
        this.errorMessage = 'Something wrong. Please check network connection or try again later.';
      } else if (err.status === 401) {
        this.errorMessage = 'Your session has expired. Please logout and log in again.';
      } else {
        this.errorMessage = 'Something wrong. Please try again later.';
      }
    });
  }
  getUserFromForm(): User {
    const user = new User();
    user.username = this.username.value;
    user.fullName = this.fullName.value;
    user.email = this.email.value;
    user.departmentId = this.department.value;
    user.roleCollection = [this.role.value];
    user.groupCollection = [this.group.value];
    return user;
  }

  checkUsername() {
    if (this.username.valid) {
      this.subUsername = this.userService.checkUsername(this.username.value).subscribe(userId => {
        this.username.setErrors({ duplicate: true});
        this.duplicateUsernameId = userId;
      }, (err => {
        console.log(err);
      }));
    }
  }
  checkEmail() {
    if (this.email.valid) {
      this.subEmail = this.userService.checkEmail(this.email.value).subscribe(userId => {
        this.duplicateEmailId = userId;
        this.email.setErrors({ duplicate: true });
      });
    }
  }

  navUserNameDetailUrl() {
    if (this.duplicateUsernameId) {
      this.navigationService.navUserDetail(this.duplicateUsernameId);
    }
  }
  navEmailDetailUrl() {
    if (this.duplicateEmailId) {
      this.navigationService.navUserDetail(this.duplicateEmailId);
    }
  }
  navUserList() {
    this.navigationService.navUserList();
  }

  onReset() {
    this.form.reset();
    this.department.setValue('');
    this.role.setValue('');
    this.group.setValue('');
  }
  onCancel() {
    this.navigationService.navUserList();
  }
  onNewDepartment() {
    $('#modal_add_department').modal({
      show: true,
      backdrop: 'static'
    });
  }
  departmentSubmitted(event) {
    if (event === 'success') {
      this.subDepartment = this.getAllService.getAllDepartments().subscribe(departments => {
        this.departments = departments;
        $('#modal_add_department').modal('toggle');
      });
    }
  }


  buildForm() {
    const usernameRegex = new RegExp(REGEX.USERNAME);
    // tslint:disable-next-line:max-line-length
    const emailRegex = new RegExp(REGEX.EMAIL);
    this.form = new FormGroup({
      fullName: new FormControl(''),
      username: new FormControl('', [
        CommonValidator.required(),
        CommonValidator.pattern(usernameRegex)
      ]),
      email: new FormControl('', [
        CommonValidator.required(),
        CommonValidator.pattern(emailRegex)
      ]),
      department: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      group: new FormControl('', [Validators.required])
    });
  }
  get fullName() {
    return this.form.get('fullName');
  }
  get username() {
    return this.form.get('username');
  }
  get email() {
    return this.form.get('email');
  }
  get department() {
    return this.form.get('department');
  }
  get role() {
    return this.form.get('role');
  }
  get group() {
    return this.form.get('group');
  }

  ngOnDestroy() {
    if (this.subDepartment) {
      this.subDepartment.unsubscribe();
    }
    if (this.subEmail) {
      this.subEmail.unsubscribe();
    }
    if (this.subRole) {
      this.subRole.unsubscribe();
    }
    if (this.subUsername) {
      this.subUsername.unsubscribe();
    }
    if (this.subTimer) {
      this.subTimer.unsubscribe();
    }
    if (this.subGroup) {
      this.subGroup.unsubscribe();
    }
  }
}
