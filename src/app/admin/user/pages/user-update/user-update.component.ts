import { Component, OnInit, OnDestroy } from '@angular/core';
import { Department } from '../../../../model/department.class';
import { Role } from '../../../../model/role.class';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { GetAllService } from '../../../../core/services/get-all.service';
import { NavigationService } from '../../../../core/services/navigation.service';
import { User } from '../../../../model/user.class';
import { ActivatedRoute } from '@angular/router';
import { Helpers } from '../../../../helpers';
import { timer } from 'rxjs/observable/timer';
import { take, map } from 'rxjs/operators';
import { Group } from '../../../../model/group';

declare var $: any;

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit, OnDestroy {
  // To enable loading icon
  globalBodyClass = 'm-page--loading-non-block m-page--fluid m--skin- m-content--skin-light2 m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default';
  // To store user from UserService or getting from server
  user: User;

  inputConstraints = {
    varcharMaxLength: 255,
  };

  // To disable submit button and show loading icon
  loading = false;

  // To show error/success message after submitting form
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

  // To store id of user with this username or email
  duplicateUsernameId: number;
  duplicateEmailId: number;

  form: FormGroup;

  constructor(
    private userService: UserService,
    private getAllService: GetAllService,
    private navigationService: NavigationService,
    private route: ActivatedRoute
  ) {
    this.user = userService.user;
  }

  ngOnInit() {
    this.buildForm();
    this.route.paramMap.subscribe(paramsMap => {
      const userId = parseInt(paramsMap.get('id'), 10);
      if (this.user && this.user.id === userId) {
        this.setFormValues();
      } else {
        // This happens when user refresh browser or go to the page directly.
        this.userService.getOne(userId).subscribe(user => {
          console.log('Getting user from server');
          this.user = user;
          this.setFormValues();
        });
      }
    });
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
    this.successMessage = '';
    // Show loading
    Helpers.setLoading(true);
    Helpers.bodyClass(this.globalBodyClass);

    this.userService.updateUser(this.getUpdatedUser()).subscribe(res => {
      console.log(res);
      this.loading = false;
      this.form.reset();
      Helpers.setLoading(false);
      this.successMessage = 'User updated! An email has been sent to the user.';
      this.subTimer = timer(0, 1000).pipe(
        take(this.timer),
        map(() => {
          --this.timer;
        })
      ).subscribe(() => {
        if (this.timer === 0) {
          this.navigationService.navUserList();
        }
      });
      // this.subTimer = IntervalObservable.create(3000)
      //   .subscribe( (time) => {
      //   console.log(time);
      //   this.timer = time / 1000;
      // });
    }, err => {
      this.loading = false;
      Helpers.setLoading(false);
      if (err instanceof ErrorEvent) {
        this.errorMessage = 'Something wrong. Please check network connection or try again later.';
      } else if (err.status === 401) {
        this.errorMessage = 'Your session has expired. Please logout and log in again.';
      } else {
        this.errorMessage = 'Something wrong. Please try again later.';
      }
    });
  }
  /**
  * WhatItDoes gets update info from Form and create a new user.
  * CreatedBy ldthien
  * CreatedAt 2018/03/21
  */
  getUpdatedUser(): User {
    const user = new User();
    user.id = this.user.id;
    user.username = this.username.value;
    user.fullName = this.fullName.value;
    user.email = this.email.value;
    user.departmentId = new Department(this.department.value);
    const role = new Role(this.role.value);
    user.roleCollection = [role];
    const group = new Group(this.group.value);
    user.groupCollection = [group];
    return user;
  }

  /**
  * WhatItDoes checks if the updated username exists.
  * CreatedBy ldthien
  * CreatedAt 2018/03/21
  */
  checkUsername() {
    if (this.username.value && this.username.value !== this.user.username) {
      this.subUsername = this.userService.checkUsername(this.username.value).subscribe(userId => {
        this.username.setErrors({ duplicate: true });
        this.duplicateUsernameId = userId;
      }, (err => {
        console.error(err);
      }));
    }
  }
  /**
  * WhatItDoes checks if the updated email exists.
  * CreatedBy ldthien
  * CreatedAt 2018/03/21
  */
  checkEmail() {
    if (this.email.value && this.email.value !== this.user.email) {
      this.subEmail = this.userService.checkEmail(this.email.value).subscribe(userId => {
        this.duplicateEmailId = userId;
        this.email.setErrors({ duplicate: true });
      }, err => console.error(err));
    }
  }

  /**
  * WhatItDoes navigates to user detail page with found id.
  * CreatedBy ldthien
  * CreatedAt 2018/03/21
  */
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
    this.setFormValues();
  }
  onCancel() {
    this.navigationService.navUserList();
  }
  onNewDepartment() {
    $('#modal_add_department').appendTo('body').modal('show');
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
    this.form = new FormGroup({
      fullName: new FormControl(''),
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      department: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      group: new FormControl('', [Validators.required])
    });
  }
  setFormValues() {
    this.fullName.setValue(this.user.fullName);
    this.username.setValue(this.user.username);
    this.email.setValue(this.user.email);
    this.department.setValue(this.user.departmentId.id);
    this.role.setValue(this.user.roleCollection[0].id);
    this.group.setValue(this.user.groupCollection[0].id);
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
    if (this.subGroup) {
      this.subGroup.unsubscribe();
    }
    if (this.subUsername) {
      this.subUsername.unsubscribe();
    }
    if (this.subTimer) {
      this.subTimer.unsubscribe();
    }
  }
}
