import { ILog } from './../model/log.interface';
import { IStatus } from './../model/status.interface';
import { IRecruitmentType } from './../model/recruitment-type.interface';
import { IProject } from './../model/project.interface';
import { IExperience } from './../model/experience.interface';
import { IPosition } from './../model/position.interface';
import { ISkill } from './../model/skill.interface';
import { IRole } from './../model/role.interface';
import { IDepartment } from './../model/department.interface';
import { ICandidate } from './../model/candidate.interface';
import { IRequest } from './../model/request.interface';
import { IUser } from './../model/user.interface';
import { BaseModel } from '../model/base-model.interface';
import { IPriority } from '../model/priority.interface';
import { IComment } from '../model/comment.interface';
import { ICv } from '../model/cv.interface';
import { IForeignLanguage } from '../model/foreign-language.interface';
import { IRequestAssignee } from '../model/request-assignee.interface';
import { IInterview } from '../model/interview.interface';
import { ICvUrl } from '../model/cv-url.interface';

export interface IDomainState {
  users: BaseModel<IUser>;
  departments: BaseModel<IDepartment>;
  roles: BaseModel<IRole>;
  requests: BaseModel<IRequest>;
  skills: BaseModel<ISkill>;
  positions: BaseModel<IPosition>;
  experiences: BaseModel<IExperience>;
  projects: BaseModel<IProject>;
  foreignLanguages: BaseModel<IForeignLanguage>;
  recruitmentTypes: BaseModel<IRecruitmentType>;
  requestAssignees: BaseModel<IRequestAssignee>;
  priorities: BaseModel<IPriority>;
  candidates: BaseModel<ICandidate>;
  candidateStatuses: BaseModel<IStatus>;
  comments: BaseModel<IComment>;
  interviews: BaseModel<IInterview>;
  cvs: BaseModel<ICv>;
  cvUrls: BaseModel<ICvUrl>;
  requestStatuses: BaseModel<IStatus>;
  cvStatuses: BaseModel<IStatus>;
  logs: BaseModel<ILog>;
  userIds: number[];
  requestIds: number[];
  commentIds: number[];
  cvIds: number[];
  candidateStatusIds: number[];
}
export const DOMAIN_INITIAL_STATE = {
  users: {},
  departments: {},
  roles: {},
  requests: {},
  skills: {},
  positions: {},
  experiences: {},
  projects: {},
  foreignLanguages: {},
  recruitmentTypes: {},
  requestAssignees: {},
  priorities: {},
  candidates: {},
  candidateStatuses: {},
  comments: {},
  interviews: {},
  cvs: {},
  cvUrls: {},
  requestStatuses: {},
  cvStatuses: {},
  logs: {},
  userIds: [],
  requestIds: [],
  commentIds: [],
  cvIds: [],
  candidateStatusIds: [],
};
