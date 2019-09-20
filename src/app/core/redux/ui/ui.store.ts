import { requestCenterUiReducer } from './request-center/request-center-ui.reducer';
import { combineReducers } from 'redux';
import { IRequestCenterUiState, REQUEST_CENTER_UI_INITIAL_STATE } from './request-center/request-center-ui.store';
import { Action } from '../root.action';
import { IGlobalUiState, GLOBAL_UI_INITIAL_STATE } from './global/store';
import { globalUiReducer } from './global/reducer';
export interface IUiState {
  requestCenterUiStore: IRequestCenterUiState;
  globalUiStore: IGlobalUiState;
}
export const UI_INITIAL_STATE = {
  requestCenterUiStore: REQUEST_CENTER_UI_INITIAL_STATE,
  globalUiStore: GLOBAL_UI_INITIAL_STATE,
};
export const uiReducer = combineReducers({
  requestCenterUiStore: requestCenterUiReducer,
  globalUiStore: globalUiReducer,
});
