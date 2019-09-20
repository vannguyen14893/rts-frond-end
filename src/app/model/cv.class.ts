import { Skill } from './skill.class';
import { Experience } from './experience.class';
import { CvUrl } from './cv-url.class';
import { Candidate } from './candidate.class';
import { User } from './user.class';
import { Status } from './status.class';
import { CommentCanidate } from './comment-canidate.class';
import { Certification } from './certification.class';

export class Cv {
    constructor(
        public id?: number,
        public title?: string,
        public fullName?: string,
        public dob?: string,
        public gender?: boolean,
        public phone?: string,
        public email?: string,
        public profileImg?: string,
        public address?: string,
        public education?: string,
        public experienceId?: Experience,
        public cvUrlCollection?: CvUrl[],
        public skillCollection?: Skill[],
        public candidateCollection?: Candidate[],
        public createdDate?: string,
        public createdBy?: User,
        public editedDate?: string,
        public editedBy?: User,
        public statusId?: Status,
        public facebook?: string,
        public skype?: string,
        public linkedin?: string,
        public note?: string,
        public comments?: CommentCanidate[],
        public selected?: boolean,
        public hover : boolean = false, //biến sử dụng để kiểm tra việc chọn xem comment hay ko. acction hiện tại chuyển từ hover về click.
        public certificationCollection?: Certification[],

    ) {

    }
}
