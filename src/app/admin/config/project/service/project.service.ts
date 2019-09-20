import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../../core/services/base.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { API_URL } from '../../../../shared/constants/api.constant';
import { Project } from '../../../../model/project.class';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProjectService extends BaseService {
  
  private findAllProjectUrl = environment.baseUrl + API_URL.FIND_ALL_PROJECT;
  private projectCreateOrUpdateUrl = environment.baseUrl + API_URL.PROJECT_CREATE_OR_UPDATE;
  private projectFindByTitleUrl = environment.baseUrl + API_URL.PROJECT_FIND_BY_TITLE;
  private project = new Project();
  getProject() {
    return this.project;
  }
  setProject(project) {
    this.project = project;
  }

  constructor(httpClient: HttpClient) { 
    super(httpClient);
  }

  findAll(params: {}): Observable<any> {
    return this.get(this.findAllProjectUrl, params);
  }

  createOrUpdate(params: {}): Observable<any> {
    return this.post(this.projectCreateOrUpdateUrl, params);
  }

  findByTitle(params: {}): Observable<any> {
    return this.get(this.projectFindByTitleUrl, params);
  }
}
