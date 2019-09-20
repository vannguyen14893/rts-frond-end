import { Candidate } from './candidate.class';
import { Status } from './status.class';
import { User } from './user.class';


export class Interview {
    constructor(
        public id?: number,
        public title?: string,
        public startTime?: any,
        public endTime?: any ,
        public location?: string,
        public note?: string,
        public userCollection?: User[],
        public candidateCollection?: Candidate[],
        public statusId?: Status
    ) {}
}
