import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { FormGroup, FormBuilder } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { ReportService } from "../../service/report.service";
import { NavigationService } from "../../../core/services/navigation.service";
import { Candidate } from "../../../model/candidate.class";
import { Page } from "../../../model/page.class";
import { UserService } from "../../../admin/user/services/user.service";
import { User } from "../../../model/user.class";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

@Component({
  selector: "app-report-am",
  templateUrl: "./report-am.component.html",
  styleUrls: ["./report-am.component.css"]
})
export class ReportAmComponent implements OnInit {
  private subscriptionCandiate: Subscription;
  private subscriptionHr: Subscription;
  public listCandidate: Candidate[];
  public requestPage: Page<any>;
  public resultMessage: string = "";
  formFilter: FormGroup;
  public listHr = User[''];

  private subRequestParams: Subscription;
  // using get first data.
  private requestParams = {
    page: 0,
    size: 25,
    sort: 'id,desc'
  };

  private params = {
    fromDate: '',
    toDate: '',
    hrmemberId: '',
  }

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
      this.getListHr();

      if (requestParams.page && requestParams.sort && requestParams.size) {
        this.requestParams.page = requestParams.page;
        this.requestParams.size = requestParams.size;
        this.requestParams.sort = requestParams.sort;

        this.params.fromDate = requestParams.fromDate;
        this.params.toDate = requestParams.toDate;
        this.params.hrmemberId = requestParams.hrmemberId;

        // set Date for form
        // if (requestParams.fromDate !== "" && requestParams.toDate !== "") {
          const startDate = requestParams.fromDate.split('/').map(Number);
          const endDate = requestParams.toDate.split('/').map(Number);
  
          this.startDate.setValue({
            day: startDate[0],
            month: startDate[1],
            year: startDate[2]
          });
  
          this.endDate.setValue({
            day: endDate[0],
            month: endDate[1],
            year: endDate[2]
          });
        // }
        this.hrId.setValue((requestParams.hrmemberId === "") ? "" : +requestParams.hrmemberId);

        this.getListCandidate(requestParams);
      } else {
        this.getListCandidate(this.requestParams);
      }

    });
  }

  private getListHr() {
    this.subscriptionHr = this.userService.getAssigneeList().subscribe(data => {
      this.listHr = data;
    }, (err: HttpErrorResponse) => {
      this.resultMessage = err.message;
    });
  };

  private getListCandidate(param) {
    this.subscriptionCandiate = this.reportService.getAllReportAm(param).subscribe((page: Page<any>) => {
      this.requestPage = page;
      if (page) {
        this.listCandidate = page.content;

      } else {
        this.resultMessage = "We found no request.";
        this.listCandidate = null;
      }
    },

      (err: HttpErrorResponse) => {
        this.resultMessage = err.message;
      }
    );
  }

  dowloadAmReport() {
    this.reportService.getAmExcel(this.params).subscribe(blob => {
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'AM Report.xlsx';
      link.click();
    });
  }

  getListInterview(form, page) {
    let startDate = '', endDate = '', hrId = '';
    if (form.startDate !== '' && form.endDate !== '' && form.startDate != null && form.endDate != null) {
      startDate = new Date(this.startDate.value.year, this.startDate.value.month - 1, this.startDate.value.day).toLocaleDateString();
      endDate = new Date(this.endDate.value.year, this.endDate.value.month - 1, this.endDate.value.day).toLocaleDateString();
    }
    if (form.hrId) {
      hrId = this.hrId.value
    } else {
      hrId = '';
    }
    if (form.startDate == null && form.endDate == null) {
      startDate = '';
      endDate = '';
    }

    const aparam = {
      page: page,
      size: 25,
      fromDate: startDate,
      toDate: endDate,
      hrmemberId: hrId,
      sort: 'id,desc'
    }

    this.params = {
      fromDate : startDate,
      toDate : endDate,
      hrmemberId : hrId
    }

    this.navigationService.navAmReportSearchWithParam(aparam);
    // this.getListCandidate(aparam);
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
  clearHr() {
    this.endDate.setValue('');
  }

  get startDate() {
    return this.formFilter.get('startDate');
  }

  get endDate() {
    return this.formFilter.get('endDate');
  }

  get hrId() {
    return this.formFilter.get('hrId');
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
