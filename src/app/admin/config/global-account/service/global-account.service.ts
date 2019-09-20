import { HttpClient } from '@angular/common/http';
import { BaseService } from './../../../../core/services/base.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { API_URL } from '../../../../shared/constants/api.constant';
import { Observable } from 'rxjs';

@Injectable()
export class GlobalAccountService extends BaseService {
  private findUrl = environment.baseUrl + API_URL.FIND_ACCOUNT_GLOBAL;
  private addUrl = environment.baseUrl + API_URL.ADD_ACCOUNT_GLOBAL;
  constructor(httpClient: HttpClient) {
    super(httpClient);
   }

  find(): Observable<any> {
    return this.get(this.findUrl);
  }

  add(params: {}): Observable<any> {
    return this.post(this.addUrl, params);
  }
}
