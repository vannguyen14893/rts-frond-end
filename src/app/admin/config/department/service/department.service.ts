import { Department } from '../../../../model/department.class';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../../core/services/base.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { API_URL } from '../../../../shared/constants/api.constant';

@Injectable()
export class DepartmentService extends BaseService {

  // To pass data to department update component
  private department: Department = new Department();
  getDepartment() {
    return this.department;
  }
  setDepartment(department) {
    this.department = department;
  }

  private findAllUrl = environment.baseUrl + API_URL.FIND_ALL_DEPARTMENT;
  private findByTitleUrl = environment.baseUrl + API_URL.DEPARTMENT_FIND_BY_TITLE;
  private createOrUpdateUrl = environment.baseUrl + API_URL.DEPARTMENT_CREATE_OR_UPDATE;

  constructor(httpClient: HttpClient) {
    super(httpClient);
   }

   findAll(params: {}): Observable<any> {
    return this.get(this.findAllUrl, params);
   }

   findByTitle(title): Observable<any> {
     return this.get(this.findByTitleUrl, title);
   }

   createOrUpdate(params: {}): Observable<any> {
     return this.post(this.createOrUpdateUrl, params);
   }
}
