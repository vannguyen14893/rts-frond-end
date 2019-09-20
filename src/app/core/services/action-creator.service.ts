import { SHOW_SWAL, HIDE_SWAL } from '../redux/root.action';
import { SET_REJECTED_REQUEST_ID } from '../redux/app/reject-request/action';
import { Candidate } from '../../model/candidate.class';
import {
  normalizeLogArray, normalizeInterviewArray, normalizeCandidateStatusArray,
  normalizeUserArray, normalizeCandidateArray } from '../redux/domain/domain.normalization';
import {
  CANDIDATE_LOGS_FETCH_ALL, CANDIDATE_INTERVIEWS_FETCH_ALL,
  CANDIDATE_STATUS_FETCH_ALL, USER_LIST_FETCH_ALL_SUCCESS, CANDIDATE_LIST_FETCH_SUCCESS, COMMENT_LIST_UPDATE
} from '../redux/domain/domain.action';
import { Log } from '../../model/log.class';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { IRootState } from '../redux/root.store';
import { select, NgRedux } from 'ng2-redux';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { API_URL } from '../../shared/constants/api.constant';
import { Page } from '../../model/page.class';
import { CONFIG } from '../../shared/constants/configuration.constant';
import {
  INTERVIEW_SELECT, REQUEST_SELECT, REQUEST_ASSIGNEE_SELECT, CURRENT_CANDIDATE_CHANGE
} from '../redux/app/request-center/request-center.action';
import { Status } from '../../model/status.class';
import { User } from '../../model/user.class';
import { MODAL_OPEN, CANDIDATE_STATUS_CHANGE, CANDIDATE_TAB_SELECT } from '../redux/ui/request-center/request-center-ui.action';
import { ISwalContent } from '../../model/swal-content.interface';
import { SET_CLOSED_REQUEST_ID } from '../redux/app/close-request/action';

@Injectable()
export class ActionCreatorService extends BaseService {

  @select((s: IRootState) => s.appStore.requestCenterStore.currentCandidateId) currentCandidateId$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentRequestId) currentRequestId$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentInterviewId) currentInterviewId$;


  private currentCandidateId = 0;
  private currentRequestId = 0;
  private currentInterviewId = 0;

  private urlGetCandidateLogs = environment.baseUrl + API_URL.LOG;
  private urlGetCandidateComments = environment.baseUrl + API_URL.COMMENT_INTERVIEW;
  private urlGetAllCandidateStatuses = environment.baseUrl + '/candidate-status/all';
  private userListUrl = environment.baseUrl + API_URL.FILTER_USER;
  private urlGetCandidateInterviews = environment.baseUrl + API_URL.INTERVIEW;
  private urlGetCandidates = environment.baseUrl + API_URL.CANDIDATE;

  constructor(
    httpClient: HttpClient,
    private ngRedux: NgRedux<IRootState>
  ) {
    super(httpClient);
    this.currentCandidateId$.subscribe(id => this.currentCandidateId = id);
    this.currentCandidateId$.subscribe(id => this.currentRequestId = id);
  }

  fetchCurrentCandidateLogs() {
    this.get(this.urlGetCandidateLogs, {
      candidateId: this.currentCandidateId,
      size: CONFIG.JAVA_MAX_INT
    }).subscribe((page: Page<Log>) => {
      this.ngRedux.dispatch({
        type: CANDIDATE_LOGS_FETCH_ALL,
        payload: normalizeLogArray(page.content)
      });
    });
  }

  fetchCurrentCandidateComments() {
    this.get(this.urlGetCandidateLogs, {
      candidateId: this.currentCandidateId,
      interviewId: this.currentInterviewId,
      size: CONFIG.JAVA_MAX_INT
    }).subscribe((page: Page<Log>) => {
      this.ngRedux.dispatch({
        type: CANDIDATE_LOGS_FETCH_ALL,
        payload: normalizeLogArray(page.content)
      });
    });
  }


  fetchCandidateInterviewsAndSelectDefault() {
    this.get(this.urlGetCandidateInterviews + '/candidate/' + this.currentCandidateId, {
      size: CONFIG.JAVA_MAX_INT
    }).subscribe(res => {
      this.ngRedux.dispatch({
        type: CANDIDATE_INTERVIEWS_FETCH_ALL,
        payload: normalizeInterviewArray(res.content)
      });
      this.ngRedux.dispatch({
        type: INTERVIEW_SELECT,
        payload: res.content[0] ? res.content[0].id : null
      });
    });
  }

  fetchAllCandidateStatuses() {
    this.get(this.urlGetAllCandidateStatuses).subscribe((res: Status[]) => {
      this.ngRedux.dispatch({
        type: CANDIDATE_STATUS_FETCH_ALL,
        payload: normalizeCandidateStatusArray(res)
      });
    });
  }

  fetchAllUser() {
    this.get(this.userListUrl, {
      size: CONFIG.JAVA_MAX_INT
    }).subscribe((res: Page<User>) => {
      if (res.content.length > 0) {
        this.ngRedux.dispatch({
          type: USER_LIST_FETCH_ALL_SUCCESS,
          payload: normalizeUserArray(res.content)
        });
      }
    });
  }

  fetchAllCandidatesOfCurrentRequest() {
    this.get(this.urlGetCandidates, {
      size: CONFIG.JAVA_MAX_INT
    }).subscribe((res: Page<Candidate>) => {
      if (res.content.length > 0) {
        this.ngRedux.dispatch({
          type: CANDIDATE_LIST_FETCH_SUCCESS,
          payload: normalizeCandidateArray(res.content)
        });
      }
    });
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

  rejectRequest(requestId: number) {
    if (requestId && requestId !== 0) {
      this.ngRedux.dispatch({
        type: SET_REJECTED_REQUEST_ID,
        payload: requestId
      });
    }
  }

  closeRequest(requestId: number) {
    if(requestId && requestId != 0) {
      this.ngRedux.dispatch({
        type: SET_CLOSED_REQUEST_ID,
        payload: requestId
      });
    }
  }

  showSwal(swalCategory: string) {
    this.ngRedux.dispatch({
      type: SHOW_SWAL,
      payload: swalCategory
    });
  }
  closeSwal() {
    this.ngRedux.dispatch({
      type: HIDE_SWAL
    });
  }
  setRequestCenterStatus (requestID: number, assigneeID: number, status: string, candidateTab: string, candidateID: number) {
    this.ngRedux.dispatch({
      type: REQUEST_SELECT,
      payload: requestID
    });
    this.ngRedux.dispatch({
      type: REQUEST_ASSIGNEE_SELECT,
      payload: assigneeID
    });
    this.ngRedux.dispatch({
      type: CANDIDATE_STATUS_CHANGE,
      payload: status
    });
    this.ngRedux.dispatch({
      type: CANDIDATE_TAB_SELECT,
      payload: candidateTab
    });
    this.ngRedux.dispatch({
      type: CURRENT_CANDIDATE_CHANGE,
      payload: candidateID
    });
  }
  setRequestStatusBar (status: string, candidateID: number) {
    this.ngRedux.dispatch({
      type: CANDIDATE_STATUS_CHANGE,
      payload: status
    });
    this.ngRedux.dispatch({
      type: CURRENT_CANDIDATE_CHANGE,
      payload: candidateID
    });
  }
  setRequestCenterAssignee(requestID: number,) {
    this.ngRedux.dispatch({
      type: REQUEST_SELECT,
      payload: requestID
    });
  }

}
