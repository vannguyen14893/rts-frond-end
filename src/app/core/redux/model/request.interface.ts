export interface IRequest {
  id?: number;
  title?: string;
  deadline?: string;
  number?: number;
  description?: string;
  major?: string;
  others?: string;
  salary?: string;
  benefit?: string;
  createdDate?: string;
  editedDate?: string;
  publishedDate?: string;
  certificate?: string;
  priorityId?: number;
  cvDeadline?: string;
  skillCollection?: number[];
  positionId?: number;
  requestStatusId?: number;
  createdBy?: number;
  editedBy?: number;
  experienceId?: number;
  projectId?: number;
  foreignLanguageCollection?: number[];
  recruitmentTypeId?: number;
  rejectReason?: string;
  requestAssignee?: number[];
  countCanidateStatusByRequestAssignee?: any;
}
