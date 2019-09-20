import { Candidate } from "./candidate.class";
import { User } from "./user.class";


export class Comment {
    constructor(
        public id?: number,
        public commentDetail?: string,
        public createDate?: string,
        public candidateId?: Candidate,
        public userId?: User
    ) {}
}
