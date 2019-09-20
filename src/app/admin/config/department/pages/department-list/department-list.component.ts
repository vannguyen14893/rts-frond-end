import { SortService } from '../../../../../core/services/sort.service';
import { NavigationService } from '../../../../../core/services/navigation.service';
import { DepartmentService } from './../../service/department.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Department } from '../../../../../model/department.class';
import { Subscription } from 'rxjs/Subscription';
import { sortByProperty } from '../../../../../shared/helpers/data.helper';
import { CONFIG } from '../../../../../shared/constants/configuration.constant';

declare var $: any;

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css']
})
export class DepartmentListComponent implements OnInit, OnDestroy {

  listDepartment: Department[];

  params = {
    page: 0,
    size: CONFIG.PAGE_SIZE,
    sort: 'id,desc'
  };

  requestPage;
  notFoundMessage = '';
  error = {
    isError: false,
    message: ''
  };

  sortDirection = 0;
  currentSortProperty = '';

  buttonClicked = false;

  subListDepartment: Subscription;
  subSortService: Subscription;

  oldDepartment: Department;

  constructor(
    private departmentService: DepartmentService,
    private navigationService: NavigationService,
    private sortService: SortService
  ) { }

  ngOnInit() {
    this.getListDepartment();
    $('#modal_update_department').on('hidden.bs.modal', function (e) {
      this.buttonClicked = false;
    });
    this.subSortService = this.sortService.columnSorted$.subscribe(colName => {
      this.sort(colName);
    });
  }

  getListDepartment() {
    this.subListDepartment = this.departmentService.findAll(this.params)
      .subscribe(response => {
        this.listDepartment = response.content;
        this.requestPage = response;
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      });
  }

  openModal() {
    $('#modal_add_department').modal({show: true, backdrop: 'static'});
  }
  departmentSubmitted(event) {
    if (event === 'success') {
      this.params.page = 0;
      // reload request list
      this.getListDepartment();
      // close modal
      $('#modal_add_department').modal('toggle');
    }
  }

  departmentUpdated(event) {
    if (event === 'success') {
      this.params.page = 0;
      // reload request list
      this.getListDepartment();
      // close modal
      $('#modal_update_department').modal('toggle');
    }
  }

  onDetail(department) {
    this.oldDepartment = department;
    this.buttonClicked = true;
    this.departmentService.setDepartment(JSON.parse(JSON.stringify(department)));
    $('#modal_update_department').modal('show');
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
    const currentSortParam = String(this.params.sort) || '';
    const splittedParams = currentSortParam.split(',');
    if (splittedParams[0] === this.currentSortProperty) {
      if (splittedParams.length > 1) {
        if (splittedParams[1] === 'desc') {
          this.params.sort = this.currentSortProperty + ',asc';
        } else if (splittedParams[1] === 'asc') {
          this.params.sort = 'id,desc';
        }
      }
    } else {
      this.params.sort = this.currentSortProperty + ',desc';
    }
    this.getListDepartment();
  }

  first() {
    if (!this.requestPage.first) {
      this.params.page = 0;
      this.getListDepartment();
    }
  }

  prev() {
    if (!this.requestPage.first) {
      this.params.page = this.requestPage.number - 1;
      this.getListDepartment();
    }

  }

  next() {
    if (!this.requestPage.last) {
      this.params.page = this.requestPage.number + 1;
      this.getListDepartment();
    }
  }

  last() {
    if (!this.requestPage.last) {
      this.params.page = this.requestPage.totalPages - 1;
      this.getListDepartment();
    }
  }

  navDepartmentList() {
    this.navigationService.navDepartmentList();
  }

  ngOnDestroy() {
    if (this.subSortService) {
      this.subSortService.unsubscribe();
    }
    if (this.subListDepartment) {
      this.subListDepartment.unsubscribe();
    }
  }
}
