import { Component, OnInit, OnDestroy } from '@angular/core';
import { sortByProperty } from '../../../shared/helpers/data.helper';
import { FormGroup, FormBuilder } from '@angular/forms';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/switchMap';
import { Subscription } from 'rxjs/Subscription';
import { InterviewService } from '../../services/interview.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { SortService } from '../../../core/services/sort.service';
import Utils from '../../../shared/helpers/util';
import { User } from '../../../model/user.class';
import { IdentityService } from '../../../core/services/identity.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-interview-list-du',
  templateUrl: './interview-list-du.component.html',
  styleUrls: ['./interview-list-du.component.css']
})
export class InterviewListDuComponent implements OnInit, OnDestroy {
  currentUser: User;
  listInterview;
  listStatus;
  listUsersInDepartment;
  listInterviewer;
  searchTitle = '';
  formFilter: FormGroup;
  sortParam = 'id,desc';
  requestId;
  requestPage;
  notFoundMessage = '';
  error = {
    isError: false,
    message: ''
  };

  subListStatus: Subscription;
  subListInterview: Subscription;
  subColumnSorted: Subscription;
  subListUsersInDepartment: Subscription;
  subListInterviewer: Subscription;
  sortDirection = 0;
  currentSortProperty = '';

  constructor(private interviewService: InterviewService,
    private navigationService: NavigationService,
    private sortService: SortService,
    private fb: FormBuilder,
    private identityService: IdentityService,
    private activatedRoute: ActivatedRoute) {
    this.formFilter = fb.group({
      startDate: '',
      endDate: '',
      requestId: '',
      interviewerId: '',
      statusId: ''
    });
  }

  ngOnInit() {
    this.subListInterview = Observable.combineLatest([this.activatedRoute.paramMap])
      .switchMap(combined => {
        let id = 0;
        try {
          id = parseInt(combined[0].get('id'), 10);
          this.requestId = id;
        } catch (err) {
          id = 0;
        }
        return this.interviewService.filterInterview({
          page: 0,
          size: 5,
          sort: this.sortParam,
          startDate: '',
          endDate: '',
          requestId: this.requestId,
          interviewStatusId: '',
          title: '',
          interviewerId: ''
        });
      })
      .subscribe(res => {
        this.listInterview = res.content;
        if (this.listInterview.length === 0) {
          this.notFoundMessage = 'No interview found.';
        } else {
          this.notFoundMessage = '';
        }
        this.error.isError = false;
        this.requestPage = res;
      }, err => {
        this.error.isError = true;
        this.error.message = err.error;
      });
    this.currentUser = this.identityService.getCurrentUser();
    this.subListStatus = this.interviewService.getAllStatus()
      .subscribe(response => {
        this.listStatus = response;
      });
    // this.subListUsersInDepartment = this.interviewService.getAllUser({id: this.currentUser.departmentId.id})
    //   .subscribe(response => {
    //     this.listUsersInDepartment = response;
    //   });
    this.subListInterviewer = this.interviewService.getAllInterviewer()
      .subscribe(response => {
        this.listInterviewer = response;
      });
    
    this.subColumnSorted = this.sortService.columnSorted$
      .subscribe(colName => {
        this.sort(colName);
      });
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
    // this.listInterview.sort(sortByProperty(property, this.sortDirection));
    //sort in server
    const currentSortParam = String(this.sortParam) || '';
    const splittedParams = currentSortParam.split(',');
    if (splittedParams[0] === this.currentSortProperty) {
      if (splittedParams.length > 1) {
        if (splittedParams[1] === 'desc') {
          this.sortParam = this.currentSortProperty + ',asc';
        } else if (splittedParams[1] === 'asc') {
          this.sortParam = 'id,desc';
        }
      }
    } else {
      this.sortParam = this.currentSortProperty + ',desc';
    }
    this.getListInterview(this.formFilter.value, this.searchTitle, 0);
  }

  clearStartDate() {
    this.startDate.setValue('');
  }
  clearEndDate() {
    this.endDate.setValue('');
  }
  
  first() {
    if (!this.requestPage.first) {
      this.getListInterview(this.formFilter.value, this.searchTitle, 0);
    }
  }

  prev() {
    if (!this.requestPage.first) {
      this.getListInterview(this.formFilter.value, this.searchTitle, this.requestPage.number - 1);
    }

  }

  next() {
    if (!this.requestPage.last) {
      this.getListInterview(this.formFilter.value, this.searchTitle, this.requestPage.number + 1);
    }
  }

  last() {
    if (!this.requestPage.last) {
      this.getListInterview(this.formFilter.value, this.searchTitle, this.requestPage.totalPages - 1);
    }
  }

  getListInterview(form, title, page) {
    let startDate = null, endDate = null;
    if (form.startDate !== '' && form.startDate != null) {
      startDate = new Date(this.startDate.value.year, this.startDate.value.month - 1, this.startDate.value.day);
    }
    if (form.endDate !== '' && form.endDate != null) {
      endDate = new Date(this.endDate.value.year, this.endDate.value.month - 1, this.endDate.value.day);
    }
    this.subListInterview = this.interviewService.filterInterview({
      page: page,
      size: 5,
      sort: this.sortParam,
      startDate: startDate ? Utils.dateToString(startDate) : '',
      endDate: endDate ? Utils.dateToString(endDate) : '',
      requestId: this.requestId,
      interviewStatusId: form.statusId,
      title: title,
      interviewerId: form.interviewerId
    })
      .subscribe(response => {
        this.listInterview = response.content;
        if (this.listInterview.length === 0) {
          this.notFoundMessage = 'No interview found.';
        } else {
          this.notFoundMessage = '';
        }
        this.error.isError = false;
        this.requestPage = response;
      }, error => {
        this.error.isError = true;
        this.error.message = error.error;
      });
  }
  onFilter() {
    this.searchTitle = '';
    this.getListInterview(this.formFilter.value, this.searchTitle, 0);
  }

  search(title) {
    this.searchTitle = title;
    this.formFilter.setValue({
      startDate: '',
      endDate: '',
      requestId: this.requestId,
      statusId: '',
      interviewerId: ''
    });
    this.getListInterview(this.formFilter.value, this.searchTitle, 0);
  }

  onDetail(id) {
    this.navigationService.navInterviewDetail(id);
  }
  getDetailUrl(id) {
    return '/interview/detail/' + id;
  }

  navInterviewList() {
    this.navigationService.navInterviewList();
  }

  get startDate() {
    return this.formFilter.get('startDate');
  }

  get endDate() {
    return this.formFilter.get('endDate');
  }

  navInterviewCreate() {
    this.navigationService.navInterviewCreate();
  }

  ngOnDestroy(): void {
    if (this.subColumnSorted) {
      this.subColumnSorted.unsubscribe();
    }
    if (this.subListInterview) {
      this.subListInterview.unsubscribe();
    }
    if (this.subListInterviewer) {
      this.subListInterviewer.unsubscribe();
    }
    if (this.subListStatus) {
      this.subListStatus.unsubscribe();
    }
    if (this.subListUsersInDepartment) {
      this.subListUsersInDepartment.unsubscribe();
    }
  }
}

