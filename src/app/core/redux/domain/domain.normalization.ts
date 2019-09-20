import { RequestAssignee } from './../../../model/requestAssignee';
import { User } from './../../../model/user.class';
import { BaseModel } from './../model/base-model.interface';
import { Candidate } from './../../../model/candidate.class';
import { schema, normalize, denormalize } from 'normalizr';
import { Request } from './../../../model/request.class';
import { Cv } from '../../../model/cv.class';
import { Log } from '../../../model/log.class';
import { Comment } from '../../../model/comment.class';
import { IRequest } from '../model/request.interface';
import { ICandidate } from '../model/candidate.interface';
import { Interview } from '../../../model/interview.class';
import { IInterview } from '../model/interview.interface';
import { Status } from '../../../model/status.class';
import { IStatus } from '../model/status.interface';
import { IUser } from '../model/user.interface';
import { IRequestAssignee } from '../model/request-assignee.interface';

// Define schemas
const getDepartmentSchema = (): schema.Entity => {
  return new schema.Entity('departments');
};
const getRoleSchema = (): schema.Entity => {
  return new schema.Entity('roles');
};
const getPositionSchema = (): schema.Entity => {
  return new schema.Entity('positions');
};
const getExperienceSchema = (): schema.Entity => {
  return new schema.Entity('experiences');
};
const getForeignLanguageSchema = (): schema.Entity => {
  return new schema.Entity('foreignLanguages');
};
const getPrioritySchema = (): schema.Entity => {
  return new schema.Entity('priorities');
};
const getProjectSchema = (): schema.Entity => {
  return new schema.Entity('projects');
};
const getRecruitmentTypeSchema = (): schema.Entity => {
  return new schema.Entity('recruitmentTypes');
};
const getSkillSchema = (): schema.Entity => {
  return new schema.Entity('skills');
};
const getRequestStatusSchema = (): schema.Entity => {
  return new schema.Entity('requestStatuses');
};
const getCandidateStatusSchema = (): schema.Entity => {
  return new schema.Entity('candidateStatuses');
};
const getCvStatusSchema = (): schema.Entity => {
  return new schema.Entity('cvStatuses');
};
const getInterviewStatusSchema = (): schema.Entity => {
  return new schema.Entity('interviewStatuses');
};
const getInterviewSchema = (): schema.Entity => {
  return new schema.Entity('interviews', {
    userCollection: [getUserSchema()],
    candidateCollection: [getCandidateSchema()],
    statusId: getInterviewStatusSchema()
  });
};
const getRequestAssigneeSchema = (): schema.Entity => {
  return new schema.Entity('requestAssignees', {
    assignee: getUserSchema()
  });
};
const getCommentSchema = (): schema.Entity => {
  return new schema.Entity('comments', {
    userId: getUserSchema()
  });
};

const getUserSchema = (): schema.Entity => {
  return new schema.Entity('users', {
    departmentId: getDepartmentSchema(),
    roleCollection: [getRoleSchema()]
  });
};

const getCvUrlSchema = (): schema.Entity => {
  return new schema.Entity('cvUrls');
};

const getRequestSchema = (): schema.Entity => {
  return new schema.Entity('requests', {
    priorityId: getPrioritySchema(),
    skillCollection: [getSkillSchema()],
    positionId: getPositionSchema(),
    requestStatusId: getRequestStatusSchema(),
    createdBy: getUserSchema(),
    editedBy: getUserSchema(),
    experienceId: getExperienceSchema(),
    projectId: getProjectSchema(),
    foreignLanguageCollection: [getForeignLanguageSchema()],
    recruitmentTypeId: getRecruitmentTypeSchema(),
    requestAssignee: [getRequestAssigneeSchema()]
  });
};
const getCvSchema = (): schema.Entity => {
  return new schema.Entity('cvs', {
    experienceId: getExperienceSchema(),
    cvUrlCollection: [getCvUrlSchema()],
    skillCollection: [getSkillSchema()],
    createdBy: getUserSchema(),
    editedBy: getUserSchema(),
    statusId: getCvStatusSchema()
  });
};
const getCandidateSchema = (): schema.Entity => {
  return new schema.Entity('candidates', {
    commentCollection: [getCommentSchema()],
    cvId: getCvSchema(),
    requestId: getRequestSchema(),
    statusId: getCandidateStatusSchema(),
    createdBy: getUserSchema()
  });
};
const getLogSchema = (): schema.Entity => {
  return new schema.Entity('logs', {
    actor: getUserSchema(),
  });
};
// end::define schemas

// Normalization: request, candidate, cv, comment, log
export const normalizeRequest = (aRequest: Request) => {
  return normalize(aRequest, getRequestSchema());
};
export const normalizeRequestArray = (requestArray: Request[]) => {
  return normalize(requestArray, [getRequestSchema()]);
};
export const normalizeCandidate = (aCandidate: Candidate) => {
  return normalize(aCandidate, getCandidateSchema());
};
export const normalizeCandidateArray = (candidateArray: Candidate[]) => {
  return normalize(candidateArray, [getCandidateSchema()]);
};
export const normalizeCv = (aCv: Cv) => {
  return normalize(aCv, getCvSchema());
};
export const normalizeCvArray = (cvArray: Cv[]) => {
  return normalize(cvArray, [getCvSchema()]);
};
export const normalizeComment = (aComment: Comment) => {
  return normalize(aComment, getCommentSchema());
};
export const normalizeCommentArray = (commentArray: Comment[]) => {
  return normalize(commentArray, [getCommentSchema()]);
};
export const normalizeLogArray = (logArray: Log[]) => {
  return normalize(logArray, [getLogSchema()]);
};
export const normalizeLog = (aLog: Log) => {
  return normalize(aLog, getLogSchema());
};
export const normalizeInterview = (anInterview: Interview) => {
  return normalize(anInterview, getInterviewSchema());
};
export const normalizeInterviewArray = (interviewArray: Interview[]) => {
  return normalize(interviewArray, [getInterviewSchema()]);
};
export const normalizeUserArray = (userArray: User[]) => {
  return normalize(userArray, [getUserSchema()]);
};
export const normalizeCandidateStatusArray = (candidateStatusArray: Status[]) => {
  return normalize(candidateStatusArray, [getCandidateStatusSchema()]);
};

// end::normalization

// denormalization
export const denormalizeRequestAssignee = (aRequestAssignee: IRequestAssignee, entities: any): RequestAssignee => {
  return denormalize(aRequestAssignee, getRequestAssigneeSchema(), entities);
};
export const denormalizeRequest = (aRequest: IRequest, entities: any): Request => {
  return denormalize(aRequest, getRequestSchema(), entities);
};
export const denormalizeCandidate = (aCandidate: ICandidate, entities: any): Candidate => {
  return denormalize(aCandidate, getCandidateSchema(), entities);
};
export const denormalizeCandidateArray = (candidateIdArray: number[], entities: any): Candidate[] => {
  return denormalize(candidateIdArray, [getCandidateSchema()], entities);
};
export const denormalizeInterview = (anInterview: IInterview, entities: any): Interview => {
  return denormalize(anInterview, getInterviewSchema(), entities);
};
export const denormalizeInterviewArray = (interviewIdArray: number[], entities: any): Interview[] => {
  return denormalize(interviewIdArray, [getInterviewSchema()], entities);
};
export const denormalizeLogArray = (logArray: number[], entities: any): Log[] => {
  return denormalize(logArray, [getLogSchema()], entities);
};
export const denormalizeUserArray = (userArray: number[], entities: any): User[] => {
  return denormalize(userArray, [getUserSchema()], entities);
};
export const denormalizeCandidateStatusArray = (candidateStatusArray: number[], entities: any): Status[] => {
  return denormalize(candidateStatusArray, [getCandidateStatusSchema()], entities);
};
export const denormalizeCandidateStatus = (aCandidateStatus: IStatus, entities: any): Status => {
  return denormalize(aCandidateStatus, getCandidateStatusSchema(), entities);
};
export const denormalizeUser = (aUser: IUser, entities: any): User => {
  return denormalize(aUser, getUserSchema(), entities);
};
// end::denormalization
