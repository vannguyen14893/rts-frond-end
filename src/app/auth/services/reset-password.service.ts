import { API_URL } from './../../shared/constants/api.constant';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ResetPasswordService {
  resetUrl = environment.baseUrl + API_URL.RESET_PASSWORD;
  constructor(private httpClient: HttpClient) { }

  resetPassword(email: string) {
    return this.httpClient.post(this.resetUrl, { 'email': email });
}
}
