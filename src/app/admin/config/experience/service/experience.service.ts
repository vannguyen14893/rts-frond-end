import { BaseService } from '../../../../core/services/base.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { API_URL } from '../../../../shared/constants/api.constant';
import { Experience } from '../../../../model/experience.class';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ExperienceService extends BaseService {
  private findAllExperienceUrl = environment.baseUrl + API_URL.FIND_ALL_EXPERIENCE;
  private experienceCreateOrUpdateUrl = environment.baseUrl + API_URL.EXPERIENCE_CREATE_OR_UPDATE;
  private experienceFindByTitleUrl = environment.baseUrl + API_URL.EXPERIENCE_FIND_BY_TITLE;
  private experience = new Experience();
  getExperience() {
    return this.experience;
  }
  setExperience(experience) {
    this.experience = experience;
  }

  constructor(httpClient: HttpClient) { 
    super(httpClient);
  }

  findAll(params: {}): Observable<any> {
    return this.get(this.findAllExperienceUrl, params);
  }

  createOrUpdate(params: {}): Observable<any> {
    return this.post(this.experienceCreateOrUpdateUrl, params);
  }

  findByTitle(params: {}): Observable<any> {
    return this.get(this.experienceFindByTitleUrl, params);
  }

}
