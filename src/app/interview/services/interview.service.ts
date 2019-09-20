import { Observable } from 'rxjs/Observable';
import { BaseService } from './../../core/services/base.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../shared/constants/api.constant';
import { environment } from '../../../environments/environment';
import { Interview } from '../../model/interview.class';

@Injectable()
export class InterviewService extends BaseService {

  private getAllStatusUrl = environment.baseUrl + API_URL.GET_ALL_INTERVIEW_STATUS;
  private getOneInterviewUrl = environment.baseUrl + API_URL.GET_ONE_INTERVIEW;
  private getCandidatesByRequest = environment.baseUrl + API_URL.FIND_ALL_CANDIDATE_BY_REQUEST;
  private getAllUserUrl = environment.baseUrl + API_URL.GET_USER_BY_DEPARTMENT;
  private getAllInterviewerUrl = environment.baseUrl + API_URL.GET_ALL_INTERVIEWERS;
  private getAllDepartmentUrl = environment.baseUrl + API_URL.GET_ALL_DEPARTMENT;
  private interviewAddUrl = environment.baseUrl + API_URL.INTERVIEW_ADD;
  private interviewUpdateUrl = environment.baseUrl + API_URL.INTERVIEW_UPDATE;
  private getCandidateURL = environment.baseUrl + API_URL.GET_ONE_CANDIDATE;
  private filterInterviewUrl = environment.baseUrl + API_URL.FILTER_INTERVIEW;
  

  interview: Interview;
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getAllStatus(): Observable<any> {
    return this.get(this.getAllStatusUrl);
  }

  getOneInterview(params: string): Observable<any> {
    return this.get(this.getOneInterviewUrl+'/'+ params);
  }

  getOne(params: number): Observable<any> {
    return this.get(this.getOneInterviewUrl+'/'+ params);
  }

  getCandidatesByRequestId(params): Observable<any>{
    return this.get(this.getCandidatesByRequest + params);
  }

  getAllUser(params: {}): Observable<any> {
    return this.get(this.getAllUserUrl, params);
  }

  getAllInterviewer(): Observable<any> {
    return this.get(this.getAllInterviewerUrl);
  }

  getAllDepartment(): Observable<any> {
    return this.get(this.getAllDepartmentUrl);
  }

  interviewAdd(interview): Observable<any> {
    return this.post(this.interviewAddUrl, interview);
  }

  interviewUpdate(interview): Observable<any> {
    return this.put(this.interviewUpdateUrl, interview);
  }

  getOneCandidate(params : {}): Observable<any> {
    return this.post(this.getCandidateURL, params);
  }

  filterInterview(params: {}): Observable<any> {
    return this.get(this.filterInterviewUrl, params);
  }
}
