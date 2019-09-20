import { CANDIDATE_STATUS } from './../../../shared/constants/status.constant';
import { denormalizeCandidate } from './../../../core/redux/domain/domain.normalization';
import { Observable } from 'rxjs/Observable';
import { MODAL_REJECT_CANDIDATE, MODAL_EDIT_CANDIDATE, MODAL_CHANGE_CANDIDATE_STATUS } from './../../../shared/constants/modal.constant';
import { IRootState } from './../../../core/redux/root.store';
import { NavigationService } from './../../../core/services/navigation.service';
import { Candidate } from './../../../model/candidate.class';
import { EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Output } from '@angular/core';
import { RequestCenterService } from './../../services/request-center.service';
import { Component, OnInit } from '@angular/core';
import { IdentityService } from '../../../core/services/identity.service';
import { select, NgRedux } from 'ng2-redux';
import { Status } from '../../../model/status.class';
import { MODAL_MAKE_INTERVIEW } from '../../../shared/constants/modal.constant';
import { MODAL_OPEN } from '../../../core/redux/ui/request-center/request-center-ui.action';
import { NEXT_CANDIDATE_STATUS_CHANGE } from '../../../core/redux/app/change-candidate-status/action';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CvDetailComponent } from '../../../cv/pages/cv-detail/cv-detail.component';
import { User } from '../../../model/user.class';
import { ActionCreatorService } from '../../../core/services/action-creator.service';
import { SwalCategory } from '../../../model/my-types';

@Component({
  selector: 'app-candidate-action-bar',
  templateUrl: './candidate-action-bar.component.html',
  styleUrls: ['./candidate-action-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateActionBarComponent implements OnInit {

  @select((s: IRootState) => s.uiStore.requestCenterUiStore.currentModal) currentModal$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentCandidateId) currentCandidateId$;
  @select((s: IRootState) => s.domainStore.candidateStatuses) candidateStatuses$;
  @select((s: IRootState) => s.domainStore.candidateStatusIds) candidateStatusIds$;
  @select((s: IRootState) => s.domainStore.candidates) candidates$;

  @Output() goComment = new EventEmitter<void>();

  currentCandidate: Candidate;
  remainingStatusIds: number[];
  nextCandidateStatusId = CANDIDATE_STATUS.ONBOARD_ID;

  modalMakeInterview = MODAL_MAKE_INTERVIEW;
  modalRejectCandidate = MODAL_REJECT_CANDIDATE;
  modalEditCandidate = MODAL_EDIT_CANDIDATE;
  modalChangeCandidateStatus = MODAL_CHANGE_CANDIDATE_STATUS;

  // Permissions
  currentUser: User;
  canCreateInterview = false;
  canCommentCandidate = false;
  canEditCv = false;
  canRejectCandidate = false;
  canChangeCandidateStatus = false;

  constructor(
    private identityService: IdentityService,
    private requestService: RequestCenterService,
    private navigationService: NavigationService,
    private ngRedux: NgRedux<IRootState>,
    private modalService: NgbModal,
    private ac: ActionCreatorService
  ) {
    this.currentUser = identityService.getCurrentUser();
    this.canChangeCandidateStatus = this.currentUser.permission.changeCandidateStatus;
    this.canCommentCandidate = this.currentUser.permission.commentCandidate;
    this.canEditCv = this.currentUser.permission.editCv;
    this.canRejectCandidate = this.currentUser.permission.rejectCandidate;
    this.canCreateInterview = this.currentUser.permission.createInterview;
  }

  ngOnInit() {
    Observable.combineLatest(
      this.candidates$,
      this.currentCandidateId$,
      this.candidateStatusIds$
    ).subscribe(res => {
      if (res[1] !== 0) {
        if (!this.currentCandidate || res[1] !== 0) {
          this.currentCandidate = denormalizeCandidate(res[0][res[1]], this.ngRedux.getState()['domainStore']);
          this.nextCandidateStatusId = this.currentCandidate.statusId.id < CANDIDATE_STATUS.CLOSE_ID
            ? this.currentCandidate.statusId.id + 1
            : CANDIDATE_STATUS.APPLIED_ID;
          if (res[2].length > 0) {
            this.remainingStatusIds = res[2].filter(id => id !== this.nextCandidateStatusId && id !== this.currentCandidate.statusId.id);
          }
        }
      }
    });
  }
  makeInterview() {
    this.requestService.openModal(MODAL_MAKE_INTERVIEW);
  }

  editCandidate() {
    this.navigationService.navCandidateDetail(this.currentCandidate.id);
  }
  
  rejectCandidate() {
    if (this.isMyCandidate(this.currentCandidate, this.currentUser)) {
      this.ngRedux.dispatch({
        type: NEXT_CANDIDATE_STATUS_CHANGE,
        payload: CANDIDATE_STATUS.CLOSE_ID
      });
      this.ac.openModal(MODAL_REJECT_CANDIDATE);
    } else {
      this.ac.showSwal(SwalCategory.Unauthorized);
    }
  }
  comment() {
    this.goComment.emit();
  }
  changeCandidateStatus(nextStatusId: number) {
    if (this.isMyCandidate(this.currentCandidate, this.currentUser)) {
      this.ngRedux.dispatch({
        type: NEXT_CANDIDATE_STATUS_CHANGE,
        payload: nextStatusId
      });
      this.ac.openModal(MODAL_CHANGE_CANDIDATE_STATUS);
    } else {
      this.ac.showSwal(SwalCategory.Unauthorized);
    }
  }
  private isMyCandidate(candidate: Candidate, user: User) {
    return candidate.createdBy.id === user.id;
  }
}
