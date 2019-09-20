import { Skill } from '../../../../model/skill.class';
import { Observable } from 'rxjs/Observable';
import { API_URL } from '../../../../shared/constants/api.constant';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '../../../../core/services/base.service';

@Injectable()
export class SkillService extends BaseService {
  allSkillUrl = environment.baseUrl + API_URL.GET_ALL_SKILLS;
  findAllUrl = environment.baseUrl + API_URL.FIND_ALL_SKILL;
  createOrUpdateUrl = environment.baseUrl + API_URL.SKILL_CREATE_OR_UPDATE;
  findByTitleUrl = environment.baseUrl + API_URL.SKILL_FIND_BY_TITLE;

  private skill: Skill = new Skill();

  getSkill() {
    return this.skill;
  }

  setSkill(skill: Skill) {
    this.skill = skill;
  }
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getAll(): Observable<any> {
    return this.get(this.allSkillUrl);
  }

  findAll(params: {}): Observable<any> {
    return this.get(this.findAllUrl, params);
  }

  createOrUpdate(params: {}): Observable<any> {
    return this.post(this.createOrUpdateUrl, params);
  }

  findByTitle(params): Observable<any> {
    return this.get(this.findByTitleUrl, params);
  }
}
