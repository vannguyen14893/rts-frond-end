import { User } from "./user.class";
import { Request } from "./request.class";
import { countCandidateStatus } from "./count-request-status.class";

export class RequestAssignee {
    constructor(
        public id?: number,
        public request?: Request,
        public assignee?: User,
        public numberOfCandidate?: number,
        public countRequestStatus?: countCandidateStatus,
    ){}
}