export interface ICandidate {
  id?: number;
  evaluatePoint?: number;
  cvId?: number;
  requestId?: number;
  statusId?: number;
  commentCollection?: number[];
  createdBy?: number;
  createDate?: Date | string;
  source?: string;
  title?: string;
}
