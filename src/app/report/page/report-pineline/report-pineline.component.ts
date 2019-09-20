import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Candidate } from '../../../model/candidate.class';
import { Page } from '../../../model/page.class';
import { FormGroup, FormBuilder } from '@angular/forms';
import { User } from '../../../model/user.class';
import { ReportService } from '../../service/report.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { UserService } from '../../../admin/user/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Request } from '../../../model/request.class';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { ActivatedRoute } from '../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-report-pineline',
  templateUrl: './report-pineline.component.html',
  styleUrls: ['./report-pineline.component.css']
})
export class ReportPinelineComponent implements OnInit {
  private subscriptionCandiate: Subscription;
  private subscriptionRequest: Subscription;
  private subscriptionHr: Subscription;
  public listRequest: Request[];
  public requestPage: Page<any>;
  public resultMessage: string = "";
  formFilter: FormGroup;
  public listHr = User[''];

  // using get first data.
  private requestParams = {
    page: 0,
    size: 25,
    sort: 'id,desc'
  };

  private paramsExcel = {
    fromDate: '',
    toDate: ''
  }
  private subRequestParams: Subscription;

  constructor(
    private reportService: ReportService,
    private navigationService: NavigationService,
    private userService: UserService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {
    this.formFilter = fb.group({
      startDate: [''],
      endDate: [''],
      hrId: ''
    })
  }

  ngOnInit() {
    
    this.subRequestParams = Observable.combineLatest([
      this.route.queryParams
    ]).subscribe(combined => {
      const requestParams = combined[0];

      if (requestParams.page && requestParams.sort && requestParams.size) {
        this.requestParams.page = requestParams.page;
        this.requestParams.size = requestParams.size;
        this.requestParams.sort = requestParams.sort;

        this.paramsExcel.fromDate = requestParams.fromDate;
        this.paramsExcel.toDate = requestParams.toDate;

        // set Date for form
        // if (requestParams.fromDate !== "" && requestParams.toDate !== "") {
          const startDate = requestParams.fromDate.split('/').map(Number);
          const endDate = requestParams.toDate.split('/').map(Number);
  
          this.startDate.setValue({
            year: startDate[2],
            month: startDate[1],
            day: startDate[0],
          });
  
          this.endDate.setValue({
            year: endDate[2],
            month: endDate[1],
            day: endDate[0],
          });
        // }

        this.getAllReportPineline(requestParams);
      } else {
        this.getAllReportPineline(this.requestParams);
      }

    });

  }

  private getAllReportPineline(param) {

    this.subscriptionCandiate = this.reportService.getAllReportPineline(param).subscribe((page: Page<any>) => {
      this.requestPage = page;
      if (page) {
        this.listRequest = page.content;

      } else {
        this.resultMessage = "We found no request.";
        this.listRequest = null;
      }
    },

      (err: HttpErrorResponse) => {
        this.resultMessage = err.message;
      }
    );
  }

  getListInterview(form, page) {
    let startDate = '', endDate = '', hrId = '';
    if (form.startDate !== '' && form.endDate !== '' && form.startDate != null && form.endDate != null) {
      startDate = new Date(this.startDate.value.year, this.startDate.value.month - 1, this.startDate.value.day).toLocaleDateString();
      endDate = new Date(this.endDate.value.year, this.endDate.value.month - 1, this.endDate.value.day).toLocaleDateString();
    }

    if (form.startDate == null && form.endDate == null) {
      startDate = '';
      endDate = '';
    }

    const aparam = {
      page: page,
      size: 25,
      sort: 'id,desc',
      fromDate: startDate,
      toDate: endDate
    }
    this.paramsExcel = {
      fromDate: startDate,
      toDate: endDate
    }

    this.navigationService.navPinelineReportSearchWithParam(aparam);
    // this.getAllReportPineline(aparam);
  }

  exportExcelPineline() {
    this.reportService.getPinelineExcel(this.paramsExcel).subscribe(blob => {
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'Pineline Report.xlsx';
      link.click();
    });
  }

  onFilter() {
    this.getListInterview(this.formFilter.value, 0);
  }

  first() {
    if (!this.requestPage.first) {
      this.getListInterview(this.formFilter.value, 0);
    }
  }

  prev() {
    if (!this.requestPage.first) {
      this.getListInterview(this.formFilter.value, this.requestPage.number - 1);
    }

  }

  next() {
    if (!this.requestPage.last) {
      this.getListInterview(this.formFilter.value, this.requestPage.number + 1);
    }
  }

  last() {
    if (!this.requestPage.last) {
      this.getListInterview(this.formFilter.value, this.requestPage.totalPages - 1);
    }
  }

  clearStartDate() {
    this.startDate.setValue('');
  }
  clearEndDate() {
    this.endDate.setValue('');
  }

  get startDate() {
    return this.formFilter.get('startDate');
  }

  get endDate() {
    return this.formFilter.get('endDate');
  }

  navInterviewList() {
    this.navigationService.navInterviewList();
  }

  navInterviewCreate() {
    this.navigationService.navInterviewCreate();
  }

  ngOnDestroy(): void {
    if (this.subscriptionCandiate) {
      this.subscriptionCandiate.unsubscribe();
    }
    if (this.subscriptionHr) {
      this.subscriptionHr.unsubscribe();
    }
    if (this.subRequestParams)
      this.subRequestParams.unsubscribe();

  }

}
