import { SortService } from '../../../../core/services/sort.service';
import { CONFIG } from '../../../../shared/constants/configuration.constant';
import { UserService } from './../../services/user.service';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { IdentityService } from '../../../../core/services/identity.service';
import { Page } from '../../../../model/page.class';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../../../../model/user.class';
import { HttpErrorResponse } from '@angular/common/http';
import { NavigationService } from '../../../../core/services/navigation.service';
import { ScriptLoaderService } from '../../../../core/services/script-loader.service';
import { Role } from '../../../../model/role.class';
import { sortByProperty } from '../../../../shared/helpers/data.helper';
import { GetAllService } from '../../../../core/services/get-all.service';

declare var $: any;

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy, AfterViewInit {

  users: User[];
  selectedUser: User;
  currentUser: User;
  resultMessage: string;
  subscriptionUser: Subscription;
  subscriptionRole: Subscription;
  public skills;
  requestPage: Page<User>;
  // To show or hide SetActiveComponent
  isModalOpen = false;

  // For filter and search
  roles: Role[];

  requestParams = {
    input: '',
    roleId: '',
    sort: 'id,desc',
    page: 0,
    size: CONFIG.PAGE_SIZE,
  };

  // config
  config = {
    searchMaxLength: CONFIG.SEARCH_MAX_LENGTH,
  };

  // for sorting
  columnSortedSubscription: Subscription;
  sortDirection = 0;
  currentSortProperty = '';

  constructor(
    private userService: UserService,
    private identityService: IdentityService,
    private navigationService: NavigationService,
    private _script: ScriptLoaderService,
    private sortService: SortService,
    private getAllService: GetAllService,
  ) {
  }

  ngOnInit() {
    this.currentUser = this.identityService.getCurrentUser();
    this.getUsers();
    this.columnSortedSubscription = this.sortService.columnSorted$.subscribe(colName => {
      this.sort(colName);
    });
    this.subscriptionRole = this.getAllService.getAllRoles().subscribe((roles: Role[]) => {
      this.roles = roles;
    });
  }

  onUserAdditionSuccess() {
    this.getUsers();
  }

  private getUsers() {
    this.subscriptionUser = this.userService.filter(this.requestParams).subscribe((page: Page<User>) => {
      this.requestPage = page;
      this.users = page.content;
      if (this.users.length === 0) {
        this.resultMessage = 'No user found.';
      } else {
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      }
    }, (err: HttpErrorResponse) => {
      console.log('>>>> UserListComponent > getUsers error: ', err);
      if (err.error instanceof ErrorEvent) {
        this.resultMessage = 'We cannot connect the server right now. Please try again later.';
      } else {
        this.resultMessage = 'Internal Server error. Please try again later.';
      }
    });
  }
  search(searchForm) {
    this.resultMessage = '';
    this.requestParams.page = 0;
    this.requestParams.input = searchForm.value;
    this.requestParams.roleId = '';
    this.userService.filter(this.requestParams);
    this.getUsers();
  }

  sort(property: string) {
    if (this.currentSortProperty === '') {
      this.currentSortProperty = property;
    }
    if (this.currentSortProperty !== property) {
      this.sortDirection = 0;
      this.currentSortProperty = property;
    }

    this.sortDirection = (this.sortDirection === 0) ? 1 : (this.sortDirection === 1) ? -1 : 0;
    const currentSortParam = String(this.requestParams.sort) || '';
    const params = currentSortParam.split(',');
    if (params[0] === this.currentSortProperty) {
      if (params.length > 1) {
        if (params[1] === 'desc') {
          this.requestParams.sort = this.currentSortProperty + ',asc';
        } else if (params[1] === 'asc') {
          this.requestParams.sort = 'id,desc';
        }
      }
    } else {
      this.requestParams.sort = this.currentSortProperty + ',desc';
    }
    this.getUsers();
  }
  filter(roleId) {
    this.resultMessage = '';
    this.requestParams.page = 0;
    this.requestParams.input = '';
    this.requestParams.roleId = roleId.value;
    this.userService.filter(this.requestParams);
    this.getUsers();
  }

  onUpdate(user) {
    this.userService.user = user;
    this.navigationService.navUserDetail(user.id);
  }
  onSetStatus(user: User) {
    this.selectedUser = user;
    this.isModalOpen = true;
  }
  onStatusChanged(result: string) {
    this.isModalOpen = false;
    if (result === 'success') {
      const index = this.users.findIndex(user => user.id === this.selectedUser.id);
      this.selectedUser.isActive = !this.selectedUser.isActive;
      console.log('selected User', this.selectedUser);
      console.log('selected user in the list', this.users[index]);
      this.users[index].isActive = this.selectedUser.isActive;
      console.log('status after changed', this.users[index].isActive);
    }
  }
  closeModal(message: string) {
    this.isModalOpen = false;
  }

  prev() {
    if (this.requestPage && !this.requestPage.first) {
      this.requestParams.page = this.requestPage.number - 1;
      this.getUsers();
    }
  }
  first() {
    if (this.requestPage && !this.requestPage.first) {
      this.requestParams.page = 0;
      this.getUsers();
    }
  }
  next() {
    if (this.requestPage && !this.requestPage.last) {
      this.requestParams.page = this.requestPage.number + 1;
      this.getUsers();
    }
  }
  last() {
    if (this.requestPage && !this.requestPage.last) {
      this.requestParams.page = this.requestPage.totalPages - 1;
      this.getUsers();
    }
  }

  navUserCreate() {
    this.navigationService.navUserCreate();
  }
  navUserList() {
    this.navigationService.navUserList();
  }

  ngOnDestroy() {
    if (this.subscriptionUser) {
      this.subscriptionUser.unsubscribe();
    }
    if (this.subscriptionRole) {
      this.subscriptionRole.unsubscribe();
    }
    if (this.columnSortedSubscription) {
      this.columnSortedSubscription.unsubscribe();
    }

  }

  ngAfterViewInit() {
    // this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
    //     'assets/demo/default/custom/components/forms/widgets/bootstrap-switch.js');

  }

}
