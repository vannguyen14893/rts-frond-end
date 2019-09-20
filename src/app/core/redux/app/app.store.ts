import { rejectRequestReducer } from './reject-request/reducer';
import { cvListReducer } from './cv-list/reducer';
import { requestCenterReducer } from './request-center/request-center.reducer';
import { IRequestCenterState, REQUEST_CENTER_INITIAL_STATE } from './request-center/request-center.store';
import { combineReducers } from 'redux';
import {
  CHANGE_CANDIDATE_STATUS_INITAL_STATE, IChangeCandidateStatusState,
  changeCandidateStatusReducer } from './change-candidate-status/store';
import { ICvListState, CV_LIST_INITIAL_STATE } from './cv-list/store';
import { IRejectRequestState, REJECT_REQUEST_INITAL_STATE } from './reject-request/store';
import { IClosedRequestState, CLOSE_REQUEST_INITAL_STATE } from './close-request/store';
import { closeRequestReducer } from './close-request/reducer';
export interface IAppState {
  requestCenterStore: IRequestCenterState;
  changeCandidateStatusStore: IChangeCandidateStatusState;
  cvListStore: ICvListState;
  rejectRequestStore: IRejectRequestState;
  closeRequestStore: IClosedRequestState;
}
export const APP_INITIAL_STATE = {
  requestCenterStore: REQUEST_CENTER_INITIAL_STATE,
  changeCandidateStatusStore: CHANGE_CANDIDATE_STATUS_INITAL_STATE,
  cvListStore: CV_LIST_INITIAL_STATE,
  rejectRequestStore: REJECT_REQUEST_INITAL_STATE,
  closeRequestStore : CLOSE_REQUEST_INITAL_STATE,
};
export const appReducer = combineReducers({
  requestCenterStore: requestCenterReducer,
  changeCandidateStatusStore: changeCandidateStatusReducer,
  cvListStore: cvListReducer,
  rejectRequestStore: rejectRequestReducer,
  closeRequestStore: closeRequestReducer,
});
