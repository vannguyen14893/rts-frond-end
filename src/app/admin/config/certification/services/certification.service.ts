import { BaseService } from '../../../../core/services/base.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { API_URL } from '../../../../shared/constants/api.constant';
import { Certification } from '../../../../model/certification.class';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CertificationService extends BaseService {
  private findAllCertificationUrl = environment.baseUrl + API_URL.FIND_ALL_CERTIFICATION;
  private certificationCreateOrUpdateUrl = environment.baseUrl + API_URL.CERTIFICATION_CREATE_OR_UPDATE;
  private certificationFindByTitleUrl = environment.baseUrl + API_URL.CERTIFICATION_FIND_BY_TITLE;
  private certification = new Certification();
  getCertification() {
    return this.certification;
  }
  setCertification(certification) {
    this.certification = certification;
  }

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  findAll(): Observable<any> {
    return this.get(this.findAllCertificationUrl);
  }

  createOrUpdate(params: {}): Observable<any> {
    return this.post(this.certificationCreateOrUpdateUrl, params);
  }

  findByTitle(params: {}): Observable<any> {
    return this.get(this.certificationFindByTitleUrl, params);
  }

}
