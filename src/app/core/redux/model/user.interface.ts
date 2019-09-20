export interface IUser {
  id?: number;
  username?: string;
  password?: string;
  email?: string;
  fullName?: string;
  avatarUrl?: string;
  isActive?: boolean;
  roleCollection?: number[];
  departmentId?: number;
  newPassword?: string;
}
