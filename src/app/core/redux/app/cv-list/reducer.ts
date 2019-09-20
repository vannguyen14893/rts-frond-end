import { ICvListState, CV_LIST_INITIAL_STATE } from './store';
import { Action } from '../../root.action';
import { MAKE_CANDIDATE } from './action';
import { tassign } from 'tassign';

export const cvListReducer = (state: ICvListState = CV_LIST_INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case MAKE_CANDIDATE:
      return tassign(state, { redirectedRequestId: action.payload });
    default: return state;
  }
};
