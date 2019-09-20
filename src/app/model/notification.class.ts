import { Candidate } from "./candidate.class";
import { User } from "./user.class";
import { Interview } from "./interview.class";
import { Request } from "./request.class";


export class Notification {
    constructor(
        public id?: number,
        public content?: string,
        public createDate?: string,
        public candidateId?: Candidate,
        public userId?: User,
        public interviewId?: Interview,
        public collectionNotification?: number,
        public requestId?: Request,
        public notificationType?: string,
    ) {}
}