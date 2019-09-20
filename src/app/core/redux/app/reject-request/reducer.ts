import { SET_REJECTED_REQUEST_ID, RESET_REJECTED_REQUEST_ID } from './action';
import { IRejectRequestState, REJECT_REQUEST_INITAL_STATE } from './store';
import { Action } from '../../root.action';
import { tassign } from 'tassign';

export const rejectRequestReducer = (state: IRejectRequestState = REJECT_REQUEST_INITAL_STATE, action: Action) => {
  switch (action.type) {
    case SET_REJECTED_REQUEST_ID:
      return tassign(state, { rejectedRequestId: action.payload });
    case RESET_REJECTED_REQUEST_ID:
      return tassign(state, { rejectedRequestId: 0 });
    default: return state;
  }
};
