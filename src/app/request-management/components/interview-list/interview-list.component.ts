import { MODAL_ADD_INTERVIEWER_TO_INTERVIEW, MODAL_ADD_CANDIDATE_TO_INTERVIEW, MODAL_SEND_MEETING_REQUEST } from './../../../shared/constants/modal.constant';
import { INTERVIEW_SELECT } from './../../../core/redux/app/request-center/request-center.action';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { denormalizeInterviewArray, denormalizeInterview } from './../../../core/redux/domain/domain.normalization';
import { select, NgRedux } from 'ng2-redux';
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RequestCenterService } from '../../services/request-center.service';
import { Subscription } from 'rxjs/Subscription';
import { Interview } from '../../../model/interview.class';
import { IRootState } from '../../../core/redux/root.store';
import { StoredProcedureService } from '../../../core/services/stored-procedure.service';
import { INTERVIEW_TAB_SELECT } from '../../../core/redux/ui/request-center/request-center-ui.action';

@Component({
  selector: 'app-interview-list',
  templateUrl: './interview-list.component.html',
  styleUrls: ['./interview-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterviewListComponent implements OnInit, OnDestroy {

  @select((s: IRootState) => s.appStore.requestCenterStore.currentCandidateId) currentCandidateId$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentRequestId) currentRequestId$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentInterviewId) currentInterviewId$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentCandidateInterviewIds) interviewIds$;
  @select((s: IRootState) => s.domainStore.interviews) interviews$;
  @select((s: IRootState) => s.uiStore.requestCenterUiStore.currentModal) currentModal$;
  @select((s: IRootState) => s.uiStore.requestCenterUiStore.currentInterviewTab) currentInterviewTab$;

  interviews: Interview[] = [];
  currentInterview: Interview;
  response = {};
  modalSendMeetingRequest = MODAL_SEND_MEETING_REQUEST;
  modalAddCandidateToInterview = MODAL_ADD_CANDIDATE_TO_INTERVIEW;
  modalAddInterviewerToInterview = MODAL_ADD_INTERVIEWER_TO_INTERVIEW;
  constructor(
    private requestService: RequestCenterService,
    private ngRedux: NgRedux<IRootState>,
    private sp: StoredProcedureService,
    private cdr: ChangeDetectorRef
  ) { }

  subCombined: Subscription;
  subInterviewTab: Subscription;

  ngOnInit() {
    /**
     * Subscribe interviewList để xem có bao nhiêu cuộc phỏng vấn
     * và tạo các tab hiển thị nếu nhiều hơn 1 (xem thêm HTML)
     */
    this.subCombined = Observable.combineLatest(
      this.interviews$,
      this.interviewIds$,
      this.currentInterviewId$
    ).subscribe(res => {
      this.interviews = this.sp.getInterviews(res[1]);
      this.currentInterview = this.sp.getInterview(res[2]);
      this.cdr.detectChanges();

      // if (res[0] && res[1].length > 0) {
      //   this.interviews = this.sp.getInterviews(res[1]);
      //   this.cdr.detectChanges();
      // }

      // if (res[2] !== 0) {
      //   this.currentInterview = this.sp.getInterview(res[2]);
      // }
      // this.cdr.detectChanges();
    });
  }

  selectInterview(interview: Interview) {
    this.ngRedux.dispatch({
      type: INTERVIEW_SELECT,
      payload: interview.id
    });
  }

  addInterviewer() {
    this.requestService.openModal(MODAL_ADD_INTERVIEWER_TO_INTERVIEW);
  }
  addCandidate() {
    this.requestService.openModal(MODAL_ADD_CANDIDATE_TO_INTERVIEW);
  }

  sendMeetingRequest(){
    this.requestService.openModal(MODAL_SEND_MEETING_REQUEST);
  }
  goComment() {
    const input = window.document.getElementById('myComment');
    input.scrollIntoView(true);
    input.focus();
  }

  ngOnDestroy() {
    if (this.subCombined) {
      this.subCombined.unsubscribe();
    }
    if (this.subInterviewTab) {
      this.subInterviewTab.unsubscribe();
    }
  }
}
