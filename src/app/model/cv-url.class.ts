import { Cv } from './cv.class';

export class CvUrl {
    constructor(
        public url?: string,
        public tobeDeleted?: boolean,
        public path?: string,
        public id?: Cv
    ) { }
}
