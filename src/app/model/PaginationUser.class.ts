
import { User } from './user.class';

export class PaginationUser {
    numberPage: number;
    currentPage: number;
    users: User[];

    constructor(numberPage: number, currentPage: number, users: User[]) {
        this.numberPage = numberPage;
        this.currentPage = currentPage;
        this.users = users;
    }
}