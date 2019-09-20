import { IRootState } from './../../core/redux/root.store';
import { CANDIDATE_TAB_SELECT, MODAL_OPEN } from './../../core/redux/ui/request-center/request-center-ui.action';
import { normalizeRequest, normalizeCandidateArray } from './../../core/redux/domain/domain.normalization';
import { CANDIDATE_STATUS } from './../../shared/constants/status.constant';
import { Candidate } from './../../model/candidate.class';
import { CONFIG } from './../../shared/constants/configuration.constant';
import { User } from './../../model/user.class';
import { environment } from './../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './../../core/services/base.service';
import { Injectable } from '@angular/core';
import { API_URL } from '../../shared/constants/api.constant';
import { NgRedux } from 'ng2-redux';
import 'rxjs/add/operator/switchMap';
import { RequestAssignee } from '../../model/requestAssignee';
import { Page } from '../../model/page.class';
import { Status } from '../../model/status.class';
import { Interview } from '../../model/interview.class';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler/src/core';
import { normalize, schema } from 'normalizr';
import { REQUEST_FETCH_SUCCESS, CANDIDATE_LIST_FETCH_SUCCESS } from '../../core/redux/domain/domain.action';
import { REQUEST_SELECT } from '../../core/redux/app/request-center/request-center.action';

@Injectable()
export class RequestCenterService extends BaseService {
  private urlGetRequest = environment.baseUrl + API_URL.GET_REQUEST_DETAIL;
  private urlGetCandidates = environment.baseUrl + API_URL.CANDIDATE;
  private urlGetCandidateLogs = environment.baseUrl + API_URL.LOG;
  private urlGetCandidateInterviews = environment.baseUrl + API_URL.INTERVIEW;
  private urlGetCandidateComments = environment.baseUrl + API_URL.COMMENT;
  private urlAddCandidateToInterview = environment.baseUrl + API_URL.INTERVIEW_ADD_CANDIDATES;
  private urlAddInterviewer = environment.baseUrl + API_URL.INTERVIEW_ADD_INTERVIEWERS;
  private urlGetAllInterviewStatuses = environment.baseUrl + '/interview-status/find-all-interview-status';
  private urlChangeCandidateStatus = environment.baseUrl + API_URL.CANDIDATE_CHANGE_STATUS;
  private urlPostComment = environment.baseUrl + API_URL.COMMENT;
  private urlPostCommentInterview = environment.baseUrl + API_URL.COMMENT_INTERVIEW;
  private urlMakeInterview = environment.baseUrl + API_URL.INTERVIEW_ADD;
  private sendMeetingRequestUrl = environment.baseUrl + API_URL.SEND_MEETING_REQUEST;

  constructor(
    httpClient: HttpClient,
    private ngRedux: NgRedux<IRootState>
  ) {
    super(httpClient);
  }

  getRequest(requestId: number): Observable<any> {
    return this.get(this.urlGetRequest + '/' + requestId);
  }

  fetchRequest(requestId: number): Observable<any> {
    return this.get(this.urlGetRequest + '/' + requestId);
  }
  fetchCandidatesByRequest(requestId: number): Observable<any> {
    return this.get(this.urlGetCandidates, { requestId, size: 2000, sort: 'id,desc' });
  }
  getCandidatesByRequest(requestId: number): Observable<any> {
    return this.get(this.urlGetCandidates, { requestId });
  }
  getCandidateLogs(candidateId: number): Observable<any> {
    return this.get(this.urlGetCandidateLogs, {
      candidateId,
      size: CONFIG.JAVA_MAX_INT
    });
  }
  // getCandidateInterviews(candidateId: number): Observable<any> {
  //   return this.get(this.urlGetCandidateInterviews + '/' + candidateId + '/candidate', {
  //     size: CONFIG.JAVA_MAX_INT
  //   });
  // }
  getCandidateComments(candidateId: number, interviewId: number): Observable<any> {
    return this.get(this.urlGetCandidateComments, {
      candidateId,
      interviewId,
      size: CONFIG.JAVA_MAX_INT
    });
  }
  addCandidateToInterview(interviewId: number, addedCandidateList: Candidate[]): Observable<any> {
    if (addedCandidateList && addedCandidateList.length > 0) {
      return this.post(this.urlAddCandidateToInterview, addedCandidateList, { interviewId });
    }
  }
  addInterviewers(interviewId: number, interviewers: number[]): Observable<any> {
    if (interviewers && interviewers.length > 0) {
      return this.post(this.urlAddInterviewer, interviewers, { interviewId });
    }
  }
  getAllInterviewStatuses(): Observable<any> {
    return this.get(this.urlGetAllInterviewStatuses);
  }

  changeCandidateStatus(candidateList: Candidate[], candidateStatusId: number): Observable<any> {
    if (candidateList.length > 0) {
      return this.post(this.urlChangeCandidateStatus + '?candidateStatusId=' + candidateStatusId, candidateList, {}, 'text');
    }
  }

  sendComment(comment: string, userId: number, candidateId: number, interviewId?: number): Observable<any> {
    return this.post(this.urlPostComment, comment, {
      userId,
      candidateId
    });
  }
  sendCommentInterview(stringComment: string, userId: number, candidateId: number, interviewId: number): Observable<any> {
    return this.post(this.urlPostCommentInterview, stringComment, {candidateId, interviewId});
  }
  makeInterview(interview: Interview): Observable<any> {
    return this.post(this.urlMakeInterview, interview);
  }
  openModal(modalName: string) {
    if (modalName && modalName.trim().length > 0) {
      this.ngRedux.dispatch({
        type: MODAL_OPEN,
        payload: modalName
      });
    }
  }
  closeModal() {
    this.ngRedux.dispatch({
      type: MODAL_OPEN,
      payload: ''
    });
  }

  sendMeetingRequest(interview): Observable<any>{
    return this.post(this.sendMeetingRequestUrl, interview);
  }
}
