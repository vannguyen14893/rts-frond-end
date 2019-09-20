import { User } from './user.class';
import { Comment } from './comment.class';
import { Status } from './status.class';
import { Cv } from './cv.class';
import { Request } from './request.class';
import { Interview } from './interview.class';


export class Candidate {
    constructor(
        public id?: number,
        public evaluatePoint?: number,
        public cvId?: Cv,
        public requestId?: Request,
        public statusId?: Status,
        public commentCollection?: Comment[],
        public interviewCollection?: Interview[],
        public createdBy?: User,
        public createDate?: Date | string,
        public source?: string,
        public title?: string,
        public onboardDate?: Date | string,
        public selected?: boolean, // Đánh dấu candidate có được checked box hay ko. Không thuộc backend entity.
    ) {}
}
