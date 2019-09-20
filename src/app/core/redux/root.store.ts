import { requestCenterUiReducer } from './ui/request-center/request-center-ui.reducer';
import { IRequestCenterUiState, REQUEST_CENTER_UI_INITIAL_STATE } from './ui/request-center/request-center-ui.store';
import { IAppState, APP_INITIAL_STATE, appReducer } from './app/app.store';
import { IRootState } from './root.store';
import { domainReducer } from './domain/domain.reducer';
import { combineReducers } from 'redux';
import { IDomainState, DOMAIN_INITIAL_STATE } from './domain/domain.store';
import { IUiState, UI_INITIAL_STATE, uiReducer } from './ui/ui.store';
import { IRequestCenterState, REQUEST_CENTER_INITIAL_STATE } from './app/request-center/request-center.store';
import { requestCenterReducer } from './app/request-center/request-center.reducer';

export interface IRootState {
  domainStore: IDomainState;
  // requestCenterStore: IRequestCenterState;
  // requestCenterUiStore: IRequestCenterUiState;
  appStore: IAppState;
  uiStore: IUiState;
}
export const ROOT_INITIAL_STATE: IRootState = {
  domainStore: DOMAIN_INITIAL_STATE,
  // requestCenterStore: REQUEST_CENTER_INITIAL_STATE,
  // requestCenterUiStore: REQUEST_CENTER_UI_INITIAL_STATE
  appStore: APP_INITIAL_STATE,
  uiStore: UI_INITIAL_STATE,
};
const reducer = combineReducers({
  domainStore: domainReducer,
  // requestCenterStore: requestCenterReducer,
  // requestCenterUiStore: requestCenterUiReducer,
  appStore: appReducer,
  uiStore: uiReducer,
});

export const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined;
  }

  return reducer(state, action);
};
