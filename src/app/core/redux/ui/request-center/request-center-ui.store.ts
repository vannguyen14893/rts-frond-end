import { CANDIDATE_STATUS } from './../../../../shared/constants/status.constant';
export interface IRequestCenterUiState {
  currentCandidateTab: string;
  currentCandidateStatus: string;
  currentInterviewTab: string;
  currentModal: string;
}
export const REQUEST_CENTER_UI_INITIAL_STATE: IRequestCenterUiState = {
  currentCandidateTab: CANDIDATE_STATUS.QUALIFIED,
  currentCandidateStatus: CANDIDATE_STATUS.APPLIED,
  currentInterviewTab: '',
  currentModal: ''
};
