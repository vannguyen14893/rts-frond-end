import { Observable } from 'rxjs/Observable';
import { BaseService } from './../../core/services/base.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../shared/constants/api.constant';
import { environment } from '../../../environments/environment';
import { Project } from '../../model/project.class';
import { ResponseContentType } from '@angular/http';
import { tap } from 'rxjs/operators/tap';
@Injectable()
export class ReportService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  private getAllProjectUrl = environment.baseUrl + API_URL.REPORT_GROUP;
  private getAllProjectHrMemberUrl = environment.baseUrl + API_URL.REPORT_HRMEMBER;
  private getReportAm = environment.baseUrl + API_URL.REPORT_AM;
  private UrlReportDu = environment.baseUrl + API_URL.REPORT_DU;
  private UrlReportPile = environment.baseUrl + API_URL.REPORT_PINELINE;
  private exportReportUrl = environment.baseUrl + API_URL.EXPORT_REPORT;
  private exportAmReportUrl = environment.baseUrl + API_URL.EXPORT_AM_REPORT;
  private exportDuReportUrl = environment.baseUrl + API_URL.EXPORT_DU_REPORT;

  getAllProject(): Observable<any> {
    return this.get(this.getAllProjectUrl);
  }

  getAllReportAm(param: {}): Observable<any> {
    return this.get(this.getReportAm, param);
  }

  getAllReportPineline(param: {}): Observable<any> {
    return this.get(this.UrlReportPile, param);
  }

  getAmExcel(param) {
    return this.get(this.exportAmReportUrl, param, 'blob').pipe(tap(response => {
      return response;
    }));
  }

  getDuExcel(param) {
    return this.get(this.exportDuReportUrl, param, 'blob').pipe(tap(response => {
      return response;
    }));
  }

  getPinelineExcel(param) {
    return this.get(this.exportReportUrl, param, 'blob').pipe(tap(response => {
      return response;
    }));
  }

  getAllProjectHrMember(): Observable<any> {
    return this.get(this.getAllProjectHrMemberUrl);
  }

  getReportDu(param: {}): Observable<any> {
    return this.get(this.UrlReportDu, param);
  }
}
