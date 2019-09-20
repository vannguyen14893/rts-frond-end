import { IdentityService } from './../../core/services/identity.service';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { User } from '../../model/user.class';
import { environment } from './../../../environments/environment';
import { API_URL } from './../../shared/constants/api.constant';
import { BaseService } from '../../core/services/base.service';
import 'rxjs/add/operator/map';
import { Token } from '@angular/compiler';

@Injectable()
export class LoginService extends BaseService {
  loginUrl = environment.baseUrl + API_URL.LOGIN;
  currentUserUrl = environment.baseUrl + API_URL.GET_CURRENT_USER;
  constructor(
    httpClient: HttpClient,
    private http: Http,
    private identityService: IdentityService,
  ) {
    super(httpClient);
  }

  login(user: User): Observable<Response> {
    const body = `username=${encodeURIComponent(user.username)}&password=${encodeURIComponent(user.password)}&grant_type=password`;

    // add authorize header with jwt token
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Basic ' + btoa('myclientid' + ':' + 'secret'));

    return this.http.post(this.loginUrl, body, { headers });
  }

  getCurrentUser(): Observable<any> {
    return this.identityService.getCurrentUserFromApiServer();
  }
}
