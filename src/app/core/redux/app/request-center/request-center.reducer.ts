import { CANDIDATE_LIST_FETCH_SUCCESS, CANDIDATE_INTERVIEWS_FETCH_ALL, CANDIDATE_LOGS_FETCH_ALL } from './../../domain/domain.action';
import { CANDIDATE_STATUS } from './../../../../shared/constants/status.constant';
import { Candidate } from './../../../../model/candidate.class';
import { IRequestCenterState, REQUEST_CENTER_INITIAL_STATE } from './request-center.store';
import { Action } from '../../root.action';
import {
  REQUEST_SELECT, REQUEST_ASSIGNEE_SELECT, FILTER_CANDIDATES,
  CURRENT_CANDIDATE_CHANGE, CANDIDATE_SELECT, INTERVIEW_SELECT, SELECTED_CANDIDATES_RESET, CURRENT_CANDIDATE_RESET
} from './request-center.action';
import { tassign } from 'tassign';
import { ICandidate } from '../../model/candidate.interface';

export const requestCenterReducer = (
  state: IRequestCenterState = REQUEST_CENTER_INITIAL_STATE,
  action: Action): IRequestCenterState => {
  switch (action.type) {
    case REQUEST_SELECT:
      return tassign(state, { currentRequestId: action.payload });
    case REQUEST_ASSIGNEE_SELECT:
      return tassign(state, { currentRequestAssigneeId: action.payload });
    case FILTER_CANDIDATES:
      return tassign(state, action.payload);
    case CURRENT_CANDIDATE_CHANGE:
      return tassign(state, { currentCandidateId: action.payload });
    case CANDIDATE_SELECT:
      return tassign(state, { selectedCandidateIds: action.payload });
    case INTERVIEW_SELECT:
      return tassign(state, { currentInterviewId: action.payload });
    case CANDIDATE_LIST_FETCH_SUCCESS:
    // Case này bên domainStore sẽ update mảng candidates. Bên này lưu id[].
      return tassign(state, { currentRequestCandidateIds: action.payload.result });
    case CANDIDATE_INTERVIEWS_FETCH_ALL:
    // Tương tự như case trên
      return tassign(state, { currentCandidateInterviewIds: action.payload.result });
    case CANDIDATE_LOGS_FETCH_ALL:
    // Tương tự case trên
      return tassign(state, { currentCandidateLogIds: action.payload.result });
    case SELECTED_CANDIDATES_RESET:
      return tassign(state, { selectedCandidateIds: [] });
    case CURRENT_CANDIDATE_RESET:
      return tassign(state, { currentCandidateId: action.payload });
    default: return state;
  }
};

/**
 * Payload cần chứa các thông tin sau:
 * 1. candidateIds
 * 2. candidates
 * 3. currentRequestAssigneeId
 * 4. currentCandidateStatus
 * @param state RequestCenterState
 * @param action Action
 */
function filterCandidates(state, action): IRequestCenterState {
  const candidateIdsByRequest: number[] = action.payload.candidateIds;
  const candidatesByRequest = action.payload.candidates;
  const currentRequestAssigneeId = action.payload.currentRequestAssigneeId;
  const currentCandidateStatus = action.payload.currentCandidateStatus;
  let candidateIdsByAssignee = [];
  if (currentRequestAssigneeId === 0) {
    candidateIdsByAssignee = candidateIdsByRequest;
  } else {
    candidateIdsByAssignee = candidateIdsByRequest
      .filter(id => candidatesByRequest[id].createdBy === currentRequestAssigneeId);
  }
  // Lọc candidates theo status từ candidatesByAssignee
  const appliedCandidateIds = [];
  const contactingCandidateIds = [];
  const interviewCandidateIds = [];
  const offerCandidateIds = [];
  const onboardCandidateIds = [];

  candidateIdsByAssignee.map(id => {
    switch (candidatesByRequest[id].statusId) {
      case CANDIDATE_STATUS.APPLIED_ID:
        appliedCandidateIds.push(id);
        break;
      case CANDIDATE_STATUS.CONTACTING_ID:
        contactingCandidateIds.push(id);
        break;
      case CANDIDATE_STATUS.INTERVIEW_ID:
        interviewCandidateIds.push(id);
        break;
      case CANDIDATE_STATUS.OFFER_ID:
        offerCandidateIds.push(id);
        break;
      case CANDIDATE_STATUS.ONBOARD_ID:
        onboardCandidateIds.push(id);
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
        .filter(id => candidatesByRequest[id].statusId !== CANDIDATE_STATUS.CLOSE_ID);
      break;
    case CANDIDATE_STATUS.CONTACTING:
      qualifiedCandidateIds = contactingCandidateIds
        .filter(id => candidatesByRequest[id].statusId !== CANDIDATE_STATUS.CLOSE_ID);
      break;
    case CANDIDATE_STATUS.INTERVIEW:
      qualifiedCandidateIds = interviewCandidateIds
        .filter(id => candidatesByRequest[id].statusId !== CANDIDATE_STATUS.CLOSE_ID);
      break;
    case CANDIDATE_STATUS.OFFER:
      qualifiedCandidateIds = offerCandidateIds
        .filter(id => candidatesByRequest[id].statusId !== CANDIDATE_STATUS.CLOSE_ID);
      break;
    case CANDIDATE_STATUS.ONBOARD:
      qualifiedCandidateIds = onboardCandidateIds
        .filter(id => candidatesByRequest[id].statusId !== CANDIDATE_STATUS.CLOSE_ID);
      break;
  }
  disqualifiedCandidateIds = candidateIdsByAssignee
    .filter(id => candidatesByRequest[id].statusId === CANDIDATE_STATUS.CLOSE_ID);
  return tassign(state, {
    currentCandidateIdsByAssignee: candidateIdsByAssignee,
    currentAppliedCandidateIds: appliedCandidateIds,
    currentContactingCandidateIds: contactingCandidateIds,
    currentInterviewCandidateIds: interviewCandidateIds,
    currentOfferCandidateIds: offerCandidateIds,
    currentOnboardCandidateIds: onboardCandidateIds,
    currentQualifiedCandidateIds: qualifiedCandidateIds,
    currentdisqualifiedCandidateIds: disqualifiedCandidateIds,
  });
}
