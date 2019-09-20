import { Candidate } from './candidate.class';
import { Status } from './status.class';
import { Skill } from './skill.class';
import { User } from './user.class';
import { Position } from './position.class';
import { Experience } from './experience.class';
import { Project } from './project.class';
import { ForeignLanguage } from './foreign-language.class';
import { RecruitmentType } from './recruitment-type.class';
import { Priority } from './priority.class';
import { RequestAssignee } from './requestAssignee';
import { Group } from './group';
import { Department } from './department.class';

export class Request {
    constructor(
        public id?: number,
        public title?: string,
        public deadline?: string,
        public number?: number,
        public requestCode?: string,
        public description?: string,
        public major?: string,
        public others?: string,
        public salary?: string,
        public benefit?: string,
        public createdDate?: string,
        public editedDate?: string,
        public publishedDate?: string,
        public approvedDate?: string,
        public certificate?: string,
        public priorityId?: Priority,
        public cvDeadline?: string,
        public skillCollection?: Skill[],
        public positionId?: Position,
        public departmentId?: Department,
        public requestStatusId?: Status,
        public assigneeId?: User,
        public createdBy?: User,
        public editedBy?: User,
        public candidateCollection?: Candidate[],
        public experienceId?: Experience,
        public projectId?: Project,
        public groupId?: Group,
        public foreignLanguageCollection?: ForeignLanguage[],
        public recruitmentTypeId?: RecruitmentType,
        public rejectReason?: string,
        public requestAssignee?: RequestAssignee[],
        public countCanidateStatusByRequestAssignee?: any,
        public overDue?: boolean,
        public percentDealine?: number,
        public remainDate?: number,
        public lackNumber?: number,
        public ratio?: number,
        public isFinish?: boolean,
    ) {

    }
}
