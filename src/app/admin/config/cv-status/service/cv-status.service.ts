import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../../core/services/base.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { API_URL } from '../../../../shared/constants/api.constant';
import { CvStatus } from '../../../../model/cv-status.class';

@Injectable()
export class CvStatusService extends BaseService {

  private cvStatus: CvStatus = new CvStatus();
  getCvStatus() {
    return this.cvStatus;
  }
  setCvStatus(cvStatus) {
    this.cvStatus = cvStatus;
  }

  findAllUrl = environment.baseUrl + API_URL.FIND_ALL_CV_STATUS;
  findByTitleUrl = environment.baseUrl + API_URL.CV_STATUS_FIND_BY_TITLE;
  createOrUpdateUrl = environment.baseUrl + API_URL.CV_STATUS_CREATE_OR_UPDATE;

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  findAll(params: {}): Observable<any> {
    return this.get(this.findAllUrl, params);
  }

  findByTitle(title): Observable<any> {
    return this.get(this.findByTitleUrl, title);
  }

  createOrUpdate(params: {}): Observable<any> {
    return this.post(this.createOrUpdateUrl, params);
  }

}
