import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NavigationService } from '../../../core/services/navigation.service';
import { ReportService } from '../../service/report.service';
import { Subscription } from 'rxjs';
import { reportDu } from '../../../model/report-du.class';
import { ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

@Component({
  selector: 'app-report-du',
  templateUrl: './report-du.component.html',
  styleUrls: ['./report-du.component.css']
})
export class ReportDuComponent implements OnInit {

  private subscription: Subscription;
  public listReport: reportDu[];
  changedate;
  public resultMessage: string = '';
  listYear: number[];
  year: '';
  private subRequestParams: Subscription;

  constructor(
    private reportService: ReportService,
    private navigationService: NavigationService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.subRequestParams = Observable.combineLatest([
      this.route.queryParams
    ]).subscribe(combined => {
      this.year = '';
      this.listYear = [];
      let i: number = 2017;
      this.listReport = [];
      while (i < 2031) {
        this.listYear.push(i++);
      }
      const requestParams = combined[0];
      if (requestParams.year && requestParams.year !== "") {
        this.year = requestParams.year;
      }
      this.getListCandidate(this.year);

    });
  }

  private getListCandidate(years) {
    const param = {
      year: years
    }
    this.subscription = this.reportService.getReportDu(param).subscribe((page) => {
      if (page) {
        this.listReport = page;
      } else {
        this.resultMessage = "We found no request.";
        this.listReport = null;
      }
    },
      (err: HttpErrorResponse) => {
        this.resultMessage = err.message;
      }
    );
  }

  dowloadDuReport() {
    this.reportService.getDuExcel(this.year).subscribe(blob => {
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'DU Report.xlsx';
      link.click();
    });
  }

  onChange() {
    this.navigationService.navDuReportSearchWithParam(this.year);
    // this.getListCandidate(this.year);
  }

  backToReport() {
    this.navigationService.navReportList();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.subRequestParams)
      this.subRequestParams.unsubscribe();

  }
}
