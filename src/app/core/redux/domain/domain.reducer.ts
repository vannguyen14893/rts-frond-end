import { Action } from './../root.action';
import { IDomainState, DOMAIN_INITIAL_STATE } from './domain.store';
import {
  REQUEST_FETCH_SUCCESS, CANDIDATE_LIST_FETCH_SUCCESS, CANDIDATE_STATUS_FETCH_ALL,
  CANDIDATE_LOGS_FETCH_ALL, CANDIDATE_INTERVIEWS_FETCH_ALL, USER_LIST_FETCH_ALL_SUCCESS,
  INTERVIEW_UPDATE, COMMENT_LIST_UPDATE, CANDIDATE_UPDATE, CV_UPDATE, DOMAIN_STORE_UPDATE } from './domain.action';
import { merge } from 'lodash';
import { tassign } from 'tassign';

export const domainReducer = (state: IDomainState = DOMAIN_INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case REQUEST_FETCH_SUCCESS:
      return updateNormalizedData(state, action);
    case CANDIDATE_LIST_FETCH_SUCCESS:
      return updateNormalizedData(state, action);
    case CANDIDATE_STATUS_FETCH_ALL:
      const newState2 = updateNormalizedData(state, action);
      return updateCandidateStatusIds(newState2, action);
    case CANDIDATE_LOGS_FETCH_ALL:
      return updateNormalizedData(state, action);
    case CANDIDATE_INTERVIEWS_FETCH_ALL:
      return updateNormalizedData(state, action);
    case USER_LIST_FETCH_ALL_SUCCESS:
      const newState5 = updateNormalizedData(state, action);
      return updateUserIds(newState5, action);
    case INTERVIEW_UPDATE:
      return updateNormalizedData(state, action);
    case CANDIDATE_UPDATE:
      return updateNormalizedData(state, action);
    case DOMAIN_STORE_UPDATE:
      return updateNormalizedData(state, action);
    default: return state;
  }
};
function updateNormalizedData(state: IDomainState, action: Action) {
  if (action.payload.entities) {
    return merge({}, state, action.payload.entities);
  }
  return state;
}
function updateRequestIds(state: IDomainState, action: Action) {
  if (action.payload.result) {
    return tassign(state, { requestIds: action.payload.result });
  }
  return state;
}
function updateUserIds(state: IDomainState, action: Action) {
  if (action.payload.result) {
    return merge({}, state, { userIds: action.payload.result });
  }
  return state;
}
function updateCommentIds(state: IDomainState, action: Action) {
  if (action.payload.result) {
    return merge({}, state, { commentIds: action.payload.result });
  }
  return state;
}
function updateCvIds(state: IDomainState, action: Action) {
  if (action.payload.result) {
    return merge({}, state, { cvIds: action.payload.result });
  }
  return state;
}
function updateCandidateStatusIds(state: IDomainState, action: Action) {
  if (action.payload.result) {
    // Do lấy toàn bộ status về nên ko merge mà overwrite luôn store.
    return tassign(state, { candidateStatusIds: action.payload.result });
  }
  return state;
}
