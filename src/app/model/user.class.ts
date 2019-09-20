import { Request } from './request.class';
import { Role } from './role.class';
import { Interview } from './interview.class';
import { Comment } from './comment.class';
import { Department } from './department.class';
import { Permission } from './permission.class';
import { Group } from './group';



export class User {

    constructor(
        public id?: number,
        public username?: string,
        public password?: string,
        public email?: string,
        public fullName?: string,
        public avatarUrl?: string,
        public isActive?: boolean,
        public roleCollection?: Role[],
        public groupCollection?: Group[],
        public departmentId?: Department,
        public newPassword?: string,
        public selected?: boolean, // Thuộc tính thêm vào để đánh dấu user được checked box
        public permission?: Permission, // Thêm vào để phân quyền theo ma trận
    ) {
        this.selected = false;
    }
}
