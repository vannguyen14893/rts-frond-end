import { User } from './user.class';
export class Log {
    constructor(
        public id?: number,
        public actor?: User,
        public action?: string,
        public tableName?: string,
        public content?: string,
        public log_time?: Date | string,
        public itemId?: number
    ) { }
}
