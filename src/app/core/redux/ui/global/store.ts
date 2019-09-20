import { SwalType, SwalCategory } from './../../../../model/my-types';
import { ISwalContent } from '../../../../model/swal-content.interface';

export interface IGlobalUiState {
  showSwal: boolean;
  swalCategory: string;
}
export const GLOBAL_UI_INITIAL_STATE = {
  showSwal: false,
  swalCategory: '',
};
