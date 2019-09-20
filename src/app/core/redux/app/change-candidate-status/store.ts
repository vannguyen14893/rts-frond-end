import { Action } from '../../root.action';
import { NEXT_CANDIDATE_STATUS_CHANGE } from './action';
import { tassign } from 'tassign';

export interface IChangeCandidateStatusState {
  nextCandidateStatusId: number;
}
export const CHANGE_CANDIDATE_STATUS_INITAL_STATE = {
  nextCandidateStatusId: 0,
};
export const changeCandidateStatusReducer = (state: IChangeCandidateStatusState = CHANGE_CANDIDATE_STATUS_INITAL_STATE, action: Action) => {
  switch (action.type) {
    case NEXT_CANDIDATE_STATUS_CHANGE:
      return tassign(state, { nextCandidateStatusId: action.payload });
    default: return state;
  }
};
