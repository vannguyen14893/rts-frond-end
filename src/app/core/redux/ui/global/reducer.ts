import { IGlobalUiState, GLOBAL_UI_INITIAL_STATE } from './store';
import { Action, SHOW_SWAL, HIDE_SWAL } from '../../root.action';
import { tassign } from 'tassign';

export const globalUiReducer = (state: IGlobalUiState = GLOBAL_UI_INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case SHOW_SWAL:
      return tassign(state, {
        showSwal: true,
        swalCategory: action.payload
      });
    case HIDE_SWAL:
      return GLOBAL_UI_INITIAL_STATE;
    default: return state;
  }
};
