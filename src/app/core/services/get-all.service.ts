import { Observable } from 'rxjs/Observable';
import { API_URL } from './../../shared/constants/api.constant';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '../../core/services/base.service';

@Injectable()
export class GetAllService extends BaseService {
  positionListUrl = environment.baseUrl + API_URL.GET_ALL_POSITIONS;
  allSkillUrl = environment.baseUrl + API_URL.GET_ALL_SKILLS;
  allProjectUrl = environment.baseUrl + API_URL.GET_ALL_PROJECTS;
  allExperienceUrl = environment.baseUrl + API_URL.GET_ALL_EXPERIENCES;
  allRecruitmentTypeUrl = environment.baseUrl + API_URL.GET_ALL_RECRUITMENT_TYPES;
  allForeignLanguageUrl = environment.baseUrl + API_URL.GET_ALL_FOREIGNLANGUAGES;
  allPriorityUrl = environment.baseUrl + API_URL.GET_ALL_PRIORITYS;
  allRolesUrl = environment.baseUrl + API_URL.GET_ALL_ROLES;
  allDepartmentsUrl = environment.baseUrl + API_URL.GET_ALL_DEPARTMENT;
  allHrMemberUrl = environment.baseUrl + API_URL.GET_ALL_HRMEMBER;
  allGroupUrl = environment.baseUrl + API_URL.GET_ALL_GROUP;
  allLogsRequest = environment.baseUrl + API_URL.GET_ALL_LOG_REQUEST;

  private data: string[] = [];

  constructor(
    httpClient: HttpClient
  ) {
    super(httpClient);
  }

  deleteMsg(msg: string) {
    const index: number = this.data.indexOf(msg);
    if (index !== -1) {
      this.data.splice(index, 1);
    }
  }

  getAllRoles() {
    return this.get(this.allRolesUrl);
  }

  getAllPositions(): Observable<any> {
    return this.get(this.positionListUrl);
  }

  getAllSkills(): Observable<any> {
    return this.get(this.allSkillUrl);
  }

  getAllGroups() {
    return this.get(this.allGroupUrl);
  }

  getAllProjects(): Observable<any> {
    return this.get(this.allProjectUrl);
  }

  getAllExperiences(): Observable<any> {
    return this.get(this.allExperienceUrl);
  }

  getAllRecruitmentTypes(): Observable<any> {
    return this.get(this.allRecruitmentTypeUrl);
  }

  getAllForeignLanguages(): Observable<any> {
    return this.get(this.allForeignLanguageUrl);
  }

  getAllPrioritys(): Observable<any> {
    return this.get(this.allPriorityUrl);
  }

  /**
  * WhatItDoes get all departments
  * CreatedBy ldthien
  * CreatedAt 2018/03/19
  */
  getAllDepartments(): Observable<any> {
    return this.get(this.allDepartmentsUrl);
  }

  getAllHrMember(): Observable<any> {
    return this.get(this.allHrMemberUrl);
  }
}
