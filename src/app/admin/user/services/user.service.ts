import { Observable } from 'rxjs/Observable';
import { API_URL } from '../../../shared/constants/api.constant';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../core/services/base.service';
import { Injectable } from '@angular/core';
import { User } from '../../../model/user.class';

@Injectable()
export class UserService extends BaseService {
  changePasswordUrl = environment.baseUrl + API_URL.CHANGE_PASSWORD;

  private userListUrl = environment.baseUrl + API_URL.FILTER_USER;
  private checkUsernameUrl = environment.baseUrl + API_URL.CHECK_USERNAME;
  private checkEmailUrl = environment.baseUrl + API_URL.CHECK_EMAIL;
  private addUserUrl = environment.baseUrl + API_URL.ADD_USER;
  private updateUserUrl = environment.baseUrl + API_URL.UPDATE_USER;
  private getOneUserUrl = environment.baseUrl + API_URL.GET_ONE_USER;
  private changeStatusUrl = environment.baseUrl + API_URL.CHANGE_USER_STATUS;
  private checkFileExistenceUrl = environment.baseUrl + API_URL.UPLOAD_CHECK;
  // to pass data to user update component
  user: User;

  private listCreatorUrl = environment.baseUrl + API_URL.GET_ALL_CREATOR;
  private listAssigneeUrl = environment.baseUrl + API_URL.GET_ALL_ASSIGNEE;

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
  changePassword(data): Observable<any> {
    return this.put(this.changePasswordUrl, data);
  }

  filter(params: {}) {
    return this.get(this.userListUrl, params);
  }

  checkUsername(username: string) {
    return this.post(this.checkUsernameUrl, username);
  }
  checkEmail(email: string) {
    return this.post(this.checkEmailUrl, email);
  }

  checkFileExistence(fileNames: string[]) {
    return this.post(this.checkFileExistenceUrl, fileNames);
}

  addUser(user: User) {
    return this.post(this.addUserUrl, user);
  }
  updateUser(user: User) {
    return this.put(this.updateUserUrl+'/' + user.id, user);
  }

  getOne(id: number) {
    return this.get(this.getOneUserUrl + id);
  }

  changeStatus(userId: number, isActive: boolean) {
    return this.post(this.changeStatusUrl + userId+"/setactive" + '?isActive=' + isActive, null);
  }


  getCreatorList() {
    return this.get(this.listCreatorUrl);
  }

  getAssigneeList() {
    return this.get(this.listAssigneeUrl);
  }
}
