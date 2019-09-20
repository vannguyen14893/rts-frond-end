
export class ModalMessage {
  constructor(
    public type?: 'success' | 'error' | 'warning' | 'info',
    public message?: string
  ) { }
}
