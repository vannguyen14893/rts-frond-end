export interface ILog {
  id?: number;
  actor?: number;
  action?: string;
  tableName?: string;
  content?: string;
  log_time?: Date | string;
  itemId?: number;
}
