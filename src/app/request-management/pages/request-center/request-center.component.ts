import { MODAL_ADD_CANDIDATE_TO_REQUEST, MODAL_VIEW_REQUEST_DETAIL } from './../../../shared/constants/modal.constant';
import {
  REQUEST_SELECT, CURRENT_CANDIDATE_CHANGE, INTERVIEW_SELECT, CURRENT_CANDIDATE_RESET, SELECTED_CANDIDATES_RESET
} from './../../../core/redux/app/request-center/request-center.action';
import { Observable } from 'rxjs/Observable';
import { CANDIDATE_STATUS_CHANGE } from './../../../core/redux/ui/request-center/request-center-ui.action';
import { IRootState } from './../../../core/redux/root.store';
import {
  normalizeCandidateArray, denormalizeRequest, denormalizeCandidate,
  denormalizeCandidateArray, normalizeCandidate, normalizeLogArray,
  normalizeInterviewArray, normalizeUserArray, normalizeCandidateStatusArray,
  normalizeComment
} from './../../../core/redux/domain/domain.normalization';
import {
  REQUEST_FETCH_SUCCESS, CANDIDATE_LIST_FETCH_SUCCESS, CANDIDATE_LOGS_FETCH_ALL,
  CANDIDATE_INTERVIEWS_FETCH_ALL, USER_LIST_FETCH_ALL_SUCCESS,
  CANDIDATE_STATUS_FETCH_ALL, COMMENT_LIST_UPDATE, CANDIDATE_UPDATE
} from './../../../core/redux/domain/domain.action';
import { Request } from './../../../model/request.class';
import { NavigationService } from './../../../core/services/navigation.service';
import { CANDIDATE_STATUS } from './../../../shared/constants/status.constant';
import { Candidate } from './../../../model/candidate.class';
import { IdentityService } from './../../../core/services/identity.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Cv } from '../../../model/cv.class';
import { Experience } from '../../../model/experience.class';
import { RequestAssignee } from '../../../model/requestAssignee';
import { User } from '../../../model/user.class';
import { RequestCenterService } from '../../services/request-center.service';
import 'rxjs/add/operator/switchMap';
import { select, NgRedux } from 'ng2-redux';
import { ActivatedRoute } from '@angular/router';
import { Interview } from '../../../model/interview.class';
import { Status } from '../../../model/status.class';
import { normalizeRequest } from '../../../core/redux/domain/domain.normalization';
import { Page } from '../../../model/page.class';
import { REQUEST_ASSIGNEE_SELECT, FILTER_CANDIDATES } from '../../../core/redux/app/request-center/request-center.action';
import { Log } from '../../../model/log.class';
import { ActionCreatorService } from '../../../core/services/action-creator.service';
import { MAKE_CANDIDATE } from '../../../core/redux/app/cv-list/action';
import { StoredProcedureService } from '../../../core/services/stored-procedure.service';
import { SwalCategory } from '../../../model/my-types';

@Component({
  selector: 'app-request-center',
  templateUrl: './request-center.component.html',
  styleUrls: ['./request-center.component.css']
})
export class RequestCenterComponent implements OnInit {

  @select((s: IRootState) => s.appStore.requestCenterStore.currentRequestAssigneeId) currentRequestAssigneeId$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentQualifiedCandidateIds) currentQualifiedCandidateIds$;
  @select((s: IRootState) => s.uiStore.requestCenterUiStore.currentCandidateStatus) currentCandidateStatus$;
  @select((s: IRootState) => s.domainStore.candidates) candidates$;
  @select((s: IRootState) => s.domainStore.requests) requests$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentRequestCandidateIds) candidateIds$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentCandidateInterviewIds) interviewIds$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentRequestId) currentRequestId$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentCandidateId) currentCandidateId$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentInterviewId) currentInterviewId$;
  @select((s: IRootState) => s.uiStore.requestCenterUiStore.currentModal) currentModal$;
  @select((s: IRootState) => s.uiStore.requestCenterUiStore.currentCandidateTab) currentCandidateTab$;

  currentCandidate: Candidate; // To get comment List and show info card

  @ViewChild('inputComment') inputComment: ElementRef;
  currentUser: User; // To store currently logged in user
  currentCandidateId: number; // To send comment
  currentInterview: Interview; // To send comment
  currentRequestId: number;
  currentRequest: Request;

  comment = ''; // Two-way binding with comment input

  showCandidateDetail = false; // To show or hide candidate detail
  modalAddCandidateToRequest = MODAL_ADD_CANDIDATE_TO_REQUEST;
  modalViewRequestDetail = MODAL_VIEW_REQUEST_DETAIL;

  // permissions
  canViewRequestDetail = false;
  canCreateCandidate = false;
  canCommentCandidate = false;

  constructor(
    private identityService: IdentityService,
    private requestService: RequestCenterService,
    private route: ActivatedRoute,
    private navigationService: NavigationService,
    private ngRedux: NgRedux<IRootState>,
    private actionCreatorService: ActionCreatorService,
    private sp: StoredProcedureService,
  ) {
    this.currentUser = identityService.getCurrentUser();
    this.canCommentCandidate = this.currentUser.permission.commentCandidate;
    this.canCreateCandidate = this.currentUser.permission.createCandidate;
    this.canViewRequestDetail = this.currentUser.permission.viewRequestDetail;
  }

  ngOnInit() {
    // Lấy ID của request trên URL, sau đó gọi API để lấy request và danh sách candidate.
    this.route.paramMap.switchMap(params => {
      this.currentRequestId = parseInt(params.get('id'), 10);
      return this.requestService.fetchRequest(this.currentRequestId);
    }).switchMap((res: Request) => {
      this.currentRequest = res;
      // Phân giải request và lưu vào domain store
      this.ngRedux.dispatch({
        type: REQUEST_FETCH_SUCCESS,
        payload: normalizeRequest(res)
      });
      // Lưu requestId vào appStore
      this.ngRedux.dispatch({
        type: REQUEST_SELECT,
        payload: this.currentRequestId
      });
      return this.requestService.fetchCandidatesByRequest(this.currentRequestId);
    }).subscribe((res: Page<Candidate>) => {
      // Phân giải candidate list và lưu vào trong domainStore
      this.ngRedux.dispatch({
        type: CANDIDATE_LIST_FETCH_SUCCESS,
        payload: normalizeCandidateArray(res.content)
      });
      this.ngRedux.dispatch({
        type: FILTER_CANDIDATES,
        payload: this.sp.filterCandidates()
      });
      this.ngRedux.dispatch({
        type: CURRENT_CANDIDATE_RESET,
        payload: this.sp.resetCurrentCandidate()
      });
    });

    /**
     * Nếu requestAssignee hoặc candidateStatus thay đổi
     * 1. Lọc lại candidates
     * 2. Chọn lại candidate mặc định
     * 3. Reset selected candidates
     */
    Observable.combineLatest(
      this.currentRequestAssigneeId$,
      this.currentCandidateStatus$,
    ).subscribe(res => {
      this.ngRedux.dispatch({
        type: FILTER_CANDIDATES,
        payload: this.sp.filterCandidates()
      });
      this.ngRedux.dispatch({
        type: CURRENT_CANDIDATE_RESET,
        payload: this.sp.resetCurrentCandidate()
      });
      this.ngRedux.dispatch({
        type: SELECTED_CANDIDATES_RESET,
      });
    }, err => console.log(err));
    /**
     * Nếu selectedCandidate có sự thay đổi, thực hiện các action sau:
     * 1. Get log của candidate
     * 2. Get các interview của candidate
     */
    this.currentCandidateId$.subscribe(id => {
      this.currentCandidateId = id;
      if (id !== 0) {
        // Lấy log list
        this.actionCreatorService.fetchCurrentCandidateLogs();
        // Lấy interview list và chọn 1 interview đầu làm default
        this.actionCreatorService.fetchCandidateInterviewsAndSelectDefault();
      }
    });

    /**
     * Lấy toàn bộ candidate status về lưu trong store.
     * Để hiển thị dropdown chuyển trạng thái candidate
     */
    this.actionCreatorService.fetchAllCandidateStatuses();

    /**
     * Lấy toàn bộ user về, lưu trong store
     * để phục vụ make interview, add interviewers
     */
    this.actionCreatorService.fetchAllUser();
    // Denormalize candidate để lấy full dữ liệu
    Observable.combineLatest(
      this.candidates$,
      this.currentCandidateId$,
      this.candidateIds$
    ).subscribe(res => {
      if (res[0] && res[1] !== 0) {
        this.currentCandidate = denormalizeCandidate(res[0][res[1]], this.ngRedux.getState()['domainStore']);
      }
    });
    this.currentCandidateTab$.subscribe(tabName => {
      this.ngRedux.dispatch({
        type: CURRENT_CANDIDATE_RESET,
        payload: this.sp.resetCurrentCandidate()
      });
    });
  }

  // VIEW HANDLING

  toggleCandidateDetail() {
    this.showCandidateDetail = !this.showCandidateDetail;
  }
  viewRequestDetail() {
    this.navigationService.navRequestDetail(this.currentRequestId);
  }
  addCandidateToRequest() {
    // Kiểm tra xem người đang đăng nhập có được assign request này không
    if (this.isAssignee(this.currentRequest, this.currentUser)) {
      this.ngRedux.dispatch({
        type: MAKE_CANDIDATE,
        payload: this.currentRequestId
      });
      this.navigationService.navCvList();
    } else {
      this.actionCreatorService.showSwal(SwalCategory.Unauthorized);
    }
  }
  isAssignee(request: Request, user: User) {
    return this.currentRequest.requestAssignee.findIndex(ra => ra.assignee.id === user.id) > -1;
  }

  sendComment() {
    if (this.comment && this.comment.length > 0 && this.currentCandidateId && this.currentCandidateId !== 0) {
      this.requestService
        .sendComment(this.comment, this.currentUser.id, this.currentCandidateId)
        .subscribe(res => {
          // Update store
          this.currentCandidate.commentCollection.push(res);
        this.ngRedux.dispatch({
          type: CANDIDATE_UPDATE,
          payload: normalizeCandidate(this.currentCandidate)
        });
        this.actionCreatorService.fetchCurrentCandidateLogs();
        this.comment = '';
      }, err => console.error(err));
    }
  }

  goComment() {
    const input = window.document.getElementById('myComment');
    input.scrollIntoView(true);
    input.focus();
  }
}
