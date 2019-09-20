import { Observable } from 'rxjs/Observable';
import { API_URL } from '../../../../shared/constants/api.constant';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../../core/services/base.service';
import { Priority } from '../../../../model/priority.class';
import { Injectable } from '@angular/core';

@Injectable()
export class PriorityService extends BaseService {

  private findAllPriorityUrl = environment.baseUrl + API_URL.FIND_ALL_PRIORITY;
  private priorityCreateOrUpdateUrl = environment.baseUrl + API_URL.PRIORITY_CREATE_OR_UPDATE;
  private priorityFindByTitleUrl = environment.baseUrl + API_URL.PRIORITY_FIND_BY_TITLE;
  private priority = new Priority();
  getPriority() {
    return this.priority;
  }
  setPriority(priority) {
    this.priority = priority;
  }

  constructor(httpClient: HttpClient) { 
    super(httpClient);
  }

  findAll(params: {}): Observable<any> {
    return this.get(this.findAllPriorityUrl, params);
  }

  createOrUpdate(params: {}): Observable<any> {
    return this.post(this.priorityCreateOrUpdateUrl, params);
  }

  findByTitle(params: {}): Observable<any> {
    return this.get(this.priorityFindByTitleUrl, params);
  }
}
