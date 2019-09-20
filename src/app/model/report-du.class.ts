import { Statistics } from "./statistics.class";

export class reportDu {
    constructor(
        public group? : string,
        public department?: string,
        public statisticMonth?: Statistics[],
        public total?: number,
    ) {}
}