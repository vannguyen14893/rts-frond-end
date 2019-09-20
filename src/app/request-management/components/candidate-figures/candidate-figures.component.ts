import { Observable } from 'rxjs/Observable';
import { IRequestAssignee } from './../../../core/redux/model/request-assignee.interface';
import { BaseModel } from './../../../core/redux/model/base-model.interface';
import { CANDIDATE_STATUS_CHANGE } from './../../../core/redux/ui/request-center/request-center-ui.action';
import { REQUEST_ASSIGNEE_SELECT } from './../../../core/redux/app/request-center/request-center.action';
import { IUser } from './../../../core/redux/model/user.interface';
import { IRootState } from './../../../core/redux/root.store';
import { User } from './../../../model/user.class';
import { select, NgRedux } from 'ng2-redux';
import { CANDIDATE_STATUS } from './../../../shared/constants/status.constant';
import { Candidate } from './../../../model/candidate.class';
import { Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';
import { Request } from './../../../model/request.class';
import { RequestAssignee } from '../../../model/requestAssignee';
import { StoredProcedureService } from '../../../core/services/stored-procedure.service';
import { IdentityService } from './../../../core/services/identity.service';

@Component({
  selector: 'app-candidate-figures',
  templateUrl: './candidate-figures.component.html',
  styleUrls: ['./candidate-figures.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateFiguresComponent implements OnInit {

  @select((s: IRootState) => s.appStore.requestCenterStore.currentRequestAssigneeId) currentRequestAssigneeId$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentAppliedCandidateIds) currentAppliedCandidateIds$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentContactingCandidateIds) currentContactingCandidateIds$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentInterviewCandidateIds) currentInterviewCandidateIds$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentOfferCandidateIds) currentOfferCandidateIds$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentOnboardCandidateIds) currentOnboardCandidateIds$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentRequestId) currentRequestId$;
  @select((s: IRootState) => s.domainStore.requests) requests$;
  @select((s: IRootState) => s.uiStore.requestCenterUiStore.currentCandidateStatus) currentCandidateStatus$;

  currentRequest: Request; // Để lấy request hiện tại và show target bên HTML
  currentRequestAssignee: RequestAssignee;
  currentUser: User;

  contacting = CANDIDATE_STATUS.CONTACTING;
  applied = CANDIDATE_STATUS.APPLIED;
  offer = CANDIDATE_STATUS.OFFER;
  onboard = CANDIDATE_STATUS.ONBOARD;
  interview = CANDIDATE_STATUS.INTERVIEW;
  target = 'Target';

  showDropdownMenu = false;
  hrMember = false;

  constructor(
    private identityService: IdentityService,
    private ngRedux: NgRedux<IRootState>,
    private sp: StoredProcedureService
  ) {
    this.currentUser = identityService.getCurrentUser();
    this.hrMember = this.identityService.isHrMember();
  }

  ngOnInit() {
    /**
     * Subscribe cả request và currentRequestId để tránh trường hợp có 1 nhưng ko có cả 2.
     */
    Observable.combineLatest(
      this.requests$,
      this.currentRequestId$
    ).subscribe(res => {
      if (res[0] && res[1] !== 0) {
        this.currentRequest = this.sp.getRequest(res[1]);
        if (this.hrMember) {
          this.filterAssignee();
        }
      }
    });
    this.currentRequestAssigneeId$.subscribe(id => {
      this.currentRequestAssignee = this.sp.getRequestAssignee(id);
      this.showDropdownMenu = false;
    });
  }

  // isHRMember () {
  //   return (this.currentUser.roleCollection[0].roleName === 'ROLE_HR_MEMBER');
  // }

  filterAssignee() {
    const assignee = this.currentRequest.requestAssignee.filter((el) => {
      return el.assignee.id === this.currentUser.id;
    });
    this.currentRequest.requestAssignee = assignee;
    this.ngRedux.dispatch({
      type: REQUEST_ASSIGNEE_SELECT,
      payload: assignee[0].id
    });
  }

  selectStatus(status) {
    switch (status) {
      case 'applied':
        status = CANDIDATE_STATUS.APPLIED;
        break;
      case 'contacting':
        status = CANDIDATE_STATUS.CONTACTING;
        break;
      case 'interview':
        status = CANDIDATE_STATUS.INTERVIEW;
        break;
      case 'offer':
        status = CANDIDATE_STATUS.OFFER;
        break;
      case 'onboard':
        status = CANDIDATE_STATUS.ONBOARD;
        break;
      default:
        break;
    }
    if (status !== 'target') {
      this.ngRedux.dispatch({
        type: CANDIDATE_STATUS_CHANGE,
        payload: status
      });
    }
  }

  selectRequestAssignee(requestAssigneeId: number) {
    console.log('Assignee id', requestAssigneeId);
    this.ngRedux.dispatch({
      type: REQUEST_ASSIGNEE_SELECT,
      payload: requestAssigneeId
    });
    this.toggleDropdownMenu();
  }

  toggleDropdownMenu() {
    this.showDropdownMenu = !this.showDropdownMenu;
  }
}
