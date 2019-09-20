import { User } from './user.class';
export class Department {
    constructor(
        public id?: number,
        public title?: string,
        public description?: string,
        public userCollection?: User[]
    ) { }
}
