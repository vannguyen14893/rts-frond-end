export interface Action {
  type: string;
  payload?: any;
}
export const SHOW_SWAL = 'SHOW_SWAL';
export const HIDE_SWAL = 'HIDE_SWAL';
export const LOGOUT = 'LOGOUT';
