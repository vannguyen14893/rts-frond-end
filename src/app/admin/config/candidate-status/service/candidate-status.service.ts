import { BaseService } from '../../../../core/services/base.service';
import { Injectable } from '@angular/core';
import { CandidateStatus } from '../../../../model/candidate-status.class';
import { environment } from '../../../../../environments/environment';
import { API_URL } from '../../../../shared/constants/api.constant';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CandidateStatusService extends BaseService {

  private candidateStatus: CandidateStatus = new CandidateStatus();
  getCandidateStatus() {
    return this.candidateStatus;
  }
  setCandidateStatus(candidateStatus) {
    this.candidateStatus = candidateStatus;
  }

  findAllUrl = environment.baseUrl + API_URL.FIND_ALL_CANDIDATE_STATUS;
  findByTitleUrl = environment.baseUrl + API_URL.CANDIDATE_STATUS_FIND_BY_TITLE;
  createOrUpdateUrl = environment.baseUrl + API_URL.CANDIDATE_STATUS_CREATE_OR_UPDATE;

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
