import { RecruitmentType } from '../../../../model/recruitment-type.class';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../../core/services/base.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { API_URL } from '../../../../shared/constants/api.constant';

@Injectable()
export class RecruitmentTypeService extends BaseService {

  // To pass data to recruitmentType update component
  private recruitmentType: RecruitmentType = new RecruitmentType();
  getRecruitmentType() {
    return this.recruitmentType;
  }
  setRecruitmentType(recruitmentType) {
    this.recruitmentType = recruitmentType;
  }

  findAllUrl = environment.baseUrl + API_URL.FIND_ALL_RECRUITMENT_TYPE;
  findByTitleUrl = environment.baseUrl + API_URL.RECRUITMENT_TYPE_FIND_BY_TITLE;
  createOrUpdateUrl = environment.baseUrl + API_URL.RECRUITMENT_TYPE_CREATE_OR_UPDATE;

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
