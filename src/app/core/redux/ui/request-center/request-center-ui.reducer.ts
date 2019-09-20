import { CANDIDATE_TAB_SELECT, CANDIDATE_STATUS_CHANGE, MODAL_OPEN, INTERVIEW_TAB_SELECT } from './request-center-ui.action';
import { IRequestCenterUiState, REQUEST_CENTER_UI_INITIAL_STATE } from './request-center-ui.store';
import { Action } from '../../root.action';
import { tassign } from 'tassign';

export const requestCenterUiReducer = (
  state: IRequestCenterUiState = REQUEST_CENTER_UI_INITIAL_STATE,
  action: Action): IRequestCenterUiState => {
  switch (action.type) {
    case CANDIDATE_TAB_SELECT:
      return tassign(state, { currentCandidateTab: action.payload });
    case INTERVIEW_TAB_SELECT:
      return tassign(state, { currentInterviewTab: action.payload });
    case CANDIDATE_STATUS_CHANGE:
      return tassign(state, { currentCandidateStatus: action.payload });
    case MODAL_OPEN:
      return tassign(state, { currentModal: action.payload });
    default: return state;
  }
};
