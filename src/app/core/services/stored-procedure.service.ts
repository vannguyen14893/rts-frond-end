import { ISwalContent } from './../../model/swal-content.interface';
import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IRootState } from '../redux/root.store';
import { Candidate } from '../../model/candidate.class';
import {
  denormalizeCandidate, denormalizeRequest, denormalizeCandidateStatus, denormalizeInterview,
  denormalizeUser, denormalizeCandidateArray, denormalizeInterviewArray, denormalizeLogArray,
  denormalizeCandidateStatusArray, denormalizeUserArray, denormalizeRequestAssignee
} from '../redux/domain/domain.normalization';
import { Request } from './../../model/request.class';
import { CandidateStatus } from '../../model/candidate-status.class';
import { Interview } from '../../model/interview.class';
import { User } from '../../model/user.class';
import { Log } from '../../model/log.class';
import { Status } from '../../model/status.class';
import { CANDIDATE_STATUS } from '../../shared/constants/status.constant';
import { RequestAssignee } from '../../model/requestAssignee';


@Injectable()
export class StoredProcedureService {

  constructor(
    private ngRedux: NgRedux<IRootState>
  ) {
  }

  getCandidate(candidateId: number): Candidate {
    return denormalizeCandidate(this.getDomainStore()['candidates'][candidateId], this.getDomainStore());
  }
  getRequest(requestId: number): Request {
    return denormalizeRequest(this.getDomainStore()['requests'][requestId], this.getDomainStore());
  }
  getCandidateStatus(statusId: number): CandidateStatus {
    return denormalizeCandidateStatus(this.getDomainStore()['candidateStatuses'][statusId], this.getDomainStore());
  }
  getInterview(interviewId: number): Interview {
    return denormalizeInterview(this.getDomainStore()['interviews'][interviewId], this.getDomainStore());
  }
  getUser(userId: number): User {
    return denormalizeUser(this.getDomainStore()['users'][userId], this.getDomainStore());
  }
  getRequestAssignee(requestAssigneeId: number): RequestAssignee {
    console.log('requestAssignees @sp', this.getDomainStore()['requestAssignees']);
    console.log('requestAssigneeId @sp', requestAssigneeId);
    return denormalizeRequestAssignee(this.getDomainStore()['requestAssignees'][requestAssigneeId], this.getDomainStore());
  }

  getCandidates(candidateIds: number[]): Candidate[] {
    return denormalizeCandidateArray(candidateIds, this.getDomainStore());
  }
  getInterviews(interviewIds: number[]): Interview[] {
    return denormalizeInterviewArray(interviewIds, this.getDomainStore());
  }
  getLogs(logIds: number[]): Log[] {
    return denormalizeLogArray(logIds, this.getDomainStore());
  }
  getCandidateStatuses(statusIds: number[]): Status[] {
    return denormalizeCandidateStatusArray(statusIds, this.getDomainStore());
  }
  getUsers(userIds: number[]): User[] {
    return denormalizeUserArray(userIds, this.getDomainStore());
  }
  
  filterCandidates() {
    console.log('========= FILTERING CANDIDATES =========');
    // filter sources
    const currentRequestCandidateIds = this.getRequestCenterStore()['currentRequestCandidateIds'];
    const allCandidates = this.getDomainStore()['candidates'];
    // filter triggers
    const currentCandidateStatus = this.getRequestCenterUiStore()['currentCandidateStatus'];
    const currentRequestAssigneeId = this.getRequestCenterStore()['currentRequestAssigneeId'];

    // Filter candidates by assignee
    let candidateIdsByAssignee = [];
    console.log('current request assignee id', currentRequestAssigneeId);
    if (currentRequestAssigneeId === 0) {
      candidateIdsByAssignee = currentRequestCandidateIds;
    } else {
      candidateIdsByAssignee = currentRequestCandidateIds
        .filter(id => allCandidates[id].createdBy === this.getRequestAssignee(currentRequestAssigneeId).assignee.id);
    }

    // Lọc candidates theo status từ candidatesByAssignee
    const appliedCandidateIds = [];
    const contactingCandidateIds = [];
    const interviewCandidateIds = [];
    const offerCandidateIds = [];
    const onboardCandidateIds = [];

    candidateIdsByAssignee.map(id => {
      switch (allCandidates[id].statusId) {
        case CANDIDATE_STATUS.APPLIED_ID:
          appliedCandidateIds.push(id);
          break;
        case CANDIDATE_STATUS.CONTACTING_ID:
          contactingCandidateIds.push(id);
          appliedCandidateIds.push(id);
          break;
        case CANDIDATE_STATUS.INTERVIEW_ID:
          interviewCandidateIds.push(id);
          appliedCandidateIds.push(id);
          break;
        case CANDIDATE_STATUS.OFFER_ID:
          offerCandidateIds.push(id);
          appliedCandidateIds.push(id);
          break;
        case CANDIDATE_STATUS.ONBOARD_ID:
          onboardCandidateIds.push(id);
          appliedCandidateIds.push(id);
          break;
        default: break;
      }
    });

    // Lọc candidate qualified và disqualified từ statused Candidates
    let qualifiedCandidateIds = [];
    let disqualifiedCandidateIds = [];
    switch (currentCandidateStatus) {
      case CANDIDATE_STATUS.APPLIED:
        qualifiedCandidateIds = appliedCandidateIds
          .filter(id => allCandidates[id].statusId !== CANDIDATE_STATUS.CLOSE_ID);
        break;
      case CANDIDATE_STATUS.CONTACTING:
        qualifiedCandidateIds = contactingCandidateIds
          .filter(id => allCandidates[id].statusId !== CANDIDATE_STATUS.CLOSE_ID);
        break;
      case CANDIDATE_STATUS.INTERVIEW:
        qualifiedCandidateIds = interviewCandidateIds
          .filter(id => allCandidates[id].statusId !== CANDIDATE_STATUS.CLOSE_ID);
        break;
      case CANDIDATE_STATUS.OFFER:
        qualifiedCandidateIds = offerCandidateIds
          .filter(id => allCandidates[id].statusId !== CANDIDATE_STATUS.CLOSE_ID);
        break;
      case CANDIDATE_STATUS.ONBOARD:
        qualifiedCandidateIds = onboardCandidateIds
          .filter(id => allCandidates[id].statusId !== CANDIDATE_STATUS.CLOSE_ID);
        break;
    }
    disqualifiedCandidateIds = candidateIdsByAssignee
      .filter(id => allCandidates[id].statusId === CANDIDATE_STATUS.CLOSE_ID);

    return {
      currentCandidateIdsByAssignee: candidateIdsByAssignee,
      currentAppliedCandidateIds: appliedCandidateIds,
      currentContactingCandidateIds: contactingCandidateIds,
      currentInterviewCandidateIds: interviewCandidateIds,
      currentOfferCandidateIds: offerCandidateIds,
      currentOnboardCandidateIds: onboardCandidateIds,
      currentQualifiedCandidateIds: qualifiedCandidateIds,
      currentdisqualifiedCandidateIds: disqualifiedCandidateIds,
    };
  }

  resetCurrentCandidate() {
    const currentCandidateTab = this.getRequestCenterUiStore()['currentCandidateTab'];
    const currentdisqualifiedCandidateIds = this.getRequestCenterStore()['currentdisqualifiedCandidateIds'];
    const currentQualifiedCandidateIds = this.getRequestCenterStore()['currentQualifiedCandidateIds'];
    switch (currentCandidateTab) {
      case CANDIDATE_STATUS.QUALIFIED:
        return (currentQualifiedCandidateIds.length > 0)
          ? currentQualifiedCandidateIds[0] : 0;
      case CANDIDATE_STATUS.DISQUALIFIED:
        return (currentdisqualifiedCandidateIds.length > 0)
          ? currentdisqualifiedCandidateIds[0] : 0;
      default: return 0;
    }
  }
  getSwalCategory(): string {
    return this.getGlobalUiStore()['swalCategory'];
  }


  getDomainStore() {
    return this.ngRedux.getState()['domainStore'];
  }
  private getRequestCenterStore() {
    return this.ngRedux.getState()['appStore']['requestCenterStore'];
  }
  private getRequestCenterUiStore() {
    return this.ngRedux.getState()['uiStore']['requestCenterUiStore'];
  }
  private getGlobalUiStore() {
    return this.ngRedux.getState()['uiStore']['globalUiStore'];
  }

}
