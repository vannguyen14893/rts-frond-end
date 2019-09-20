import { Cv } from './cv.class';


export class Skill {
    constructor(
        public id?: number,
        public title?: string,
        public description?: string,
        public cvCollection?: Cv[]
    ) {}
}
