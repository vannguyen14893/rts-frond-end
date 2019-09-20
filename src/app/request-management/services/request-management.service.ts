import { Request } from './../../model/request.class';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './../../core/services/base.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { API_URL } from '../../shared/constants/api.constant';
import { RequestAssignee } from '../../model/requestAssignee';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RequestManagementService extends BaseService {

  private createRequestUrl = environment.baseUrl + API_URL.CREATE_REQUEST;
  private updateRequestUrl = environment.baseUrl + API_URL.UPDATE_REQUEST;
  private requestDetailUrl = environment.baseUrl + API_URL.GET_REQUEST_DETAIL;
  private assginRequestUrl = environment.baseUrl + API_URL.ASSIGN_REQUEST;
  private closeRequestUrl = environment.baseUrl + API_URL.CLOSE_REQUEST;
  private approveRequestUrl = environment.baseUrl + API_URL.APPROVE_REQUEST;
  private rejectRequestUrl = environment.baseUrl + API_URL.REJECT_REQUEST;
  private publishRequestUrl = environment.baseUrl + API_URL.PUBLISH_REQUEST;
  submitNewRequestUrl = environment.baseUrl + API_URL.SUBMIT_NEW_REQUEST;
  filterRequestUrl = environment.baseUrl + API_URL.FILTER_REQUESTS;
  changeTargetUrl = environment.baseUrl + API_URL.CHANGE_TARGET;
  allLogsRequest = environment.baseUrl + API_URL.GET_ALL_LOG_REQUEST;

  request: Request;

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  create(request: Request) {
    return this.post(this.createRequestUrl, request);
  }

  update(request: Request) {
    return this.post(this.updateRequestUrl + '/' + request.id, request);
  }

  getOne(id: number) {
    return this.get(this.requestDetailUrl + '/' + id);
  }

  getAllLogsRequest(id) {
    return this.get(this.allLogsRequest + '?requestId=' + id + '&action=update');
  }

  assign(requestAssigneeCollection: RequestAssignee[], requestId: number) {
    return this.post(this.assginRequestUrl + '?requestId=' + requestId, requestAssigneeCollection);
  }

  close(request: Request) {
    return this.post(this.closeRequestUrl, request);
  }

  setApproveRequest(request: Request, id: number): Observable<any> {
    return this.post(this.approveRequestUrl + '?url=request/' + id, request);
  }

  setRejectRequest(request: Request, id: number): Observable<any> {
    return this.post(this.rejectRequestUrl + '?url=request/' + id, request);
  }
  submitNewRequest(request: Request): Observable<any> {
    return this.post(this.submitNewRequestUrl + '?url=request/' + request.id, request);
  }
  filter(params: {}) {
    return this.get(this.filterRequestUrl, params);
  }
  changeTarget(requestAssignee: RequestAssignee): Observable<any> {
    return this.post(this.changeTargetUrl, requestAssignee);
  }

  publishRequest(params: {}) {
    return this.get(this.publishRequestUrl, params);
  }
}
