import { IdentityService } from './../../../core/services/identity.service';
import { User } from './../../../model/user.class';
import { NavigationService } from './../../../core/services/navigation.service';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InterviewService } from './../../services/interview.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SortService } from '../../../core/services/sort.service';
import { CONFIG } from '../../../shared/constants/configuration.constant';
import { RequestManagementService } from '../../../request-management/services/request-management.service';
import 'rxjs/add/observable/combineLatest';
import { CvService } from '../../../cv/service/cv.service';

@Component({
  selector: 'app-interview-list',
  templateUrl: './interview-list.component.html',
  styleUrls: ['./interview-list.component.css']
})
export class InterviewListComponent implements OnInit, OnDestroy {

  listInterview: any[];
  listRequest;
  listStatus;
  searchTitle = '';
  formFilter: FormGroup;
  sortParam = 'id,desc';
  currentUser : User;

  requestPage;
  notFoundMessage = '';
  error = {
    isError: false,
    message: ''
  };
  paramsFindAll = {
    size: CONFIG.JAVA_MAX_INT,
  }

  subListStatus: Subscription;
  subListRequest: Subscription;
  subListInterview: Subscription;
  subColumnSorted: Subscription;

  sortDirection = 0;
  currentSortProperty = '';

  constructor(
    private cvService: CvService,
    private interviewService: InterviewService,
    private requestService: RequestManagementService,
    private navigationService: NavigationService,
    private sortService: SortService,
    private fb: FormBuilder,
    private identityService: IdentityService,
  ) {
    this.formFilter = fb.group({
      startDate: [''],
      endDate: [''],
      requestId: [''],
      statusId: ['']
    });
    this.currentUser = this.identityService.getCurrentUser();
  }

  ngOnInit() {
    this.getListInterview(this.formFilter.value, this.searchTitle, 0);

    const param = { arraySatusRequest: 'In-Progress,Approved,Pending' };
    this.subListRequest = this.cvService.getAllRequestAccept(param).subscribe(data => {
      this.listRequest = data;
    }, err => console.log('errr get request >>> ', err));

    this.subListStatus = this.interviewService.getAllStatus()
      .subscribe(response => {
        this.listStatus = response;
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
    let startDate = '', endDate = '';
    if (form.startDate !== '' && form.endDate !== '' && form.startDate != null && form.endDate != null) {
      startDate = new Date(this.startDate.value.year, this.startDate.value.month - 1, this.startDate.value.day).toLocaleDateString();
      endDate = new Date(this.endDate.value.year, this.endDate.value.month - 1, this.endDate.value.day).toLocaleDateString();
    }
    if (form.startDate == null && form.endDate == null) {
      startDate = '';
      endDate = '';
    }
    this.subListInterview = this.interviewService.filterInterview({
      page: page,
      size: 25,
      sort: this.sortParam,
      startDate: startDate,
      endDate: endDate,
      requestId: form.requestId,
      statusId: form.statusId,
      title: title
    }).subscribe(response => {
      this.listInterview = response.content;

      // Check if no interview, show message
      if (this.listInterview.length === 0) {
        this.notFoundMessage = 'No interview found.';
      } else {
        this.notFoundMessage = '';
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
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
      requestId: [''],
      statusId: ['']
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
    if (this.subListRequest) {
      this.subListRequest.unsubscribe();
    }
    if (this.subListStatus) {
      this.subListStatus.unsubscribe();
    }
  }
}
