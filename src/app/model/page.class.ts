import { Request } from './request.class';

export class Page<T> {
    constructor(
        public content: T[],
        public last: boolean,
        public totalElements: number,
        public totalPages: number,
        public size: number,
        public number: number,
        public sort: string,
        public numberOfElements: number,
        public first: boolean
    ) {}
}
