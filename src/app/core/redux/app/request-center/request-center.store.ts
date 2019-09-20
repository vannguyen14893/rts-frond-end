export interface IRequestCenterState {
  currentRequestId: number;
  currentRequestCandidateIds: number[];
  currentCandidateInterviewIds: number[];
  currentCandidateLogIds: number[];
  currentCandidateId: number;
  currentCommentIds: number[];
  selectedCandidateIds: number[];
  currentRequestAssigneeId: number;
  currentInterviewId: number;
  currentCandidateIdsByAssignee: number[];
  currentAppliedCandidateIds: number[];
  currentContactingCandidateIds: number[];
  currentInterviewCandidateIds: number[];
  currentOfferCandidateIds: number[];
  currentOnboardCandidateIds: number[];
  currentQualifiedCandidateIds: number[];
  currentdisqualifiedCandidateIds: number[];
}
export const REQUEST_CENTER_INITIAL_STATE: IRequestCenterState = {
  currentRequestId: 0,
  currentRequestCandidateIds: [],
  currentCandidateInterviewIds: [],
  currentCandidateLogIds: [],
  currentCandidateId: 0,
  currentCommentIds: [],
  selectedCandidateIds: [],
  currentRequestAssigneeId: 0,
  currentInterviewId: 0,
  currentCandidateIdsByAssignee: [],
  currentAppliedCandidateIds: [],
  currentContactingCandidateIds: [],
  currentInterviewCandidateIds: [],
  currentOfferCandidateIds: [],
  currentOnboardCandidateIds: [],
  currentQualifiedCandidateIds: [],
  currentdisqualifiedCandidateIds: [],
};
