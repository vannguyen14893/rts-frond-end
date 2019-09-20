import { Request } from './request.class';

export class Position {
    constructor(
        public id?: number,
        public title?: string,
        public description?: string,
        public requestCollection?: Request[]
    ) {}
}
