import { CONFIG } from './../../shared/constants/configuration.constant';
import { LocalStorageService } from './local-storage.service';
import { API_URL } from './../../shared/constants/api.constant';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService } from './base.service';
import { Observable } from 'rxjs/Observable';
import { Token } from './../../model/token.class';
import { User } from './../../model/user.class';
import { LOCAL_STORAGE } from '../../shared/constants/local-storage.constant';
import { ROLES } from '../../shared/constants/role.constant';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Permission } from '../../model/permission.class';

@Injectable()
export class IdentityService {
  // These 02 properties will be set right in AppComponent -> ngOnInit()
  private currentUser: User;
  private token: Token;
  private roles: string[];
  private groups: string[];
  currentUserChange$ = new Subject<any>();

  // url to get currently logged in user form API
  private currentUserUrl = environment.baseUrl + API_URL.GET_CURRENT_USER;

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) {
    this.initializeCurrentUser();
    this.initializeToken();
  }

  /**
  * @WhatItDoes Get token from localStorage and assign to the property of this service.
  * It will be called immediately when AppComponent Init()
  * @Author LDThien
  * @Date 2018/03/06
  */
  initializeToken() {
    try {
      this.token = <Token>JSON.parse(localStorage.getItem(LOCAL_STORAGE.TOKENS));
    } catch (err) {
      this.token = null;
      this.router.navigateByUrl('/auth/login');
    }
  }

  /**
  * @WhatItDoes Get currently logged in user from localStorage.
  * and assign to the property of this service.
  * It will be called immediately when AppComponent Init()
  * @Author LDThien
  * @Date 2018/03/06
  */
  initializeCurrentUser() {
    try {
      this.currentUser = <User>JSON.parse(localStorage.getItem(LOCAL_STORAGE.CURRENT_USER));
      if (this.currentUser) {
        this.roles = [];
        this.groups = [];
        for (const role of this.currentUser.roleCollection) {
          this.roles.push(role.roleName);
        }
        for(const group of this.currentUser.groupCollection){
          this.groups.push(group.title);
      }
        this.setUserPermision();
      }
    } catch (err) {
      this.currentUser = null;
    }
  }

  getCurrentUserFromApiServer(): Observable<any> {
    return this.httpClient.get(this.currentUserUrl, { headers: this.createHeaders() });
  }

  getToken() {
    return this.token || null;
  }
  getCurrentUser() {
    return this.currentUser || null;
  }
  setUserPermision() {
    this.currentUser.permission = new Permission();
    if (this.isAdmin()) {
      this.currentUser.permission.addUser = true;
      this.currentUser.permission.editAnyUser = true;
      this.currentUser.permission.viewAnyUserDetail = true;
      this.currentUser.permission.viewUserList = true;
      this.currentUser.permission.setActive = true;
      this.currentUser.permission.createPosition = true;
      this.currentUser.permission.viewPositionList = true;
      this.currentUser.permission.editPosition = true;
      this.currentUser.permission.viewProjectList = true;
      this.currentUser.permission.createProject = true;
      this.currentUser.permission.editProject = true;
      this.currentUser.permission.viewSkillList = true;
      this.currentUser.permission.createSkill = true;
      this.currentUser.permission.editSkill = true;
      this.currentUser.permission.viewExperienceList = true;
      this.currentUser.permission.createExperience = true;
      this.currentUser.permission.editExperience = true;
      this.currentUser.permission.viewPriorityList = true;
      this.currentUser.permission.createPriority = true;
      this.currentUser.permission.editPriority = true;
      this.currentUser.permission.changeMyProfile = true;
      this.currentUser.permission.viewDepartmentList = true;
      this.currentUser.permission.createDepartment = true;
      this.currentUser.permission.viewRecruitmentTypeList = true;
      this.currentUser.permission.createRecruitmentType = true;
      this.currentUser.permission.editRecruitmentType = true;
      this.currentUser.permission.viewRecruitmentTypeList = true;
      this.currentUser.permission.viewCertificationList = true;
      this.currentUser.permission.createCertification = true;
      this.currentUser.permission.editCertification = true;
    }
    if (this.isDuLead()) {
      this.currentUser.permission.viewRequestList = true;
      this.currentUser.permission.createRequest = true;
      this.currentUser.permission.editRequest = true;
      this.currentUser.permission.cloneRequest = true;
      this.currentUser.permission.viewRequestDetail = true;
      this.currentUser.permission.changeMyProfile = true;
      this.currentUser.permission.submitRequest = true;
      this.currentUser.permission.rejectCandidate = true;
      this.currentUser.permission.viewRequestCenter = true;
      this.currentUser.permission.commentCandidate = true;
      this.currentUser.permission.viewInterviewList = true;
      this.currentUser.permission.viewInterviewDetail = true;
      this.currentUser.permission.closeRequest = true;
    }
    if (this.isDuMember()) {
      this.currentUser.permission.viewRequestList = true;
      this.currentUser.permission.viewRequestDetail = true;
      this.currentUser.permission.changeMyProfile = true;
      this.currentUser.permission.viewRequestCenter = true;
      this.currentUser.permission.commentCandidate = true;
      this.currentUser.permission.viewInterviewList = true;
      this.currentUser.permission.viewInterviewDetail = true;
    }
    if (this.isGroupLead()) {
      this.currentUser.permission.viewRequestList = true;
      this.currentUser.permission.viewRequestDetail = true;
      this.currentUser.permission.changeMyProfile = true;
      this.currentUser.permission.viewRequestCenter = true;
      this.currentUser.permission.commentCandidate = true;
      this.currentUser.permission.approveRequest = true;
      this.currentUser.permission.rejectRequest = true;
      this.currentUser.permission.rejectCandidate = true;
      this.currentUser.permission.viewInterviewList = true;
      this.currentUser.permission.viewInterviewDetail = true;
      // this.currentUser.permission.viewReport = true;
      this.currentUser.permission.viewRequestList = true;
      this.currentUser.permission.closeRequest = true;
      this.currentUser.permission.createRequest = true;
      this.currentUser.permission.editRequest = true;
      this.currentUser.permission.viewReport = true;
    }
    if (this.isHrManager()) {
      this.currentUser.permission.changeMyProfile = true;
      this.currentUser.permission.editRequest = true;
      this.currentUser.permission.viewRequestDetail = true;
      this.currentUser.permission.viewRequestList = true;
      this.currentUser.permission.closeRequest = true;
      this.currentUser.permission.assignRequest = true;
      this.currentUser.permission.editTarget = true;
      this.currentUser.permission.viewRequestCenter = true;
      this.currentUser.permission.commentCandidate = true;
      this.currentUser.permission.changeCandidateStatus = true;
      this.currentUser.permission.createCandidate = true;
      this.currentUser.permission.createInterview = true;
      this.currentUser.permission.editInterview = true;
      this.currentUser.permission.rejectCandidate = true;
      this.currentUser.permission.rejectRequest = true;
      this.currentUser.permission.editCv = true;
      this.currentUser.permission.viewCvList = true;
      this.currentUser.permission.createCv = true;
      this.currentUser.permission.viewCvDetail = true;
      this.currentUser.permission.viewInterviewList = true;
      this.currentUser.permission.viewInterviewDetail = true;
      this.currentUser.permission.viewReport = true;
      this.currentUser.permission.createRequest = true ;
      this.currentUser.permission.submitRequest = true;

      this.currentUser.permission.createPosition = true;
      this.currentUser.permission.viewPositionList = true;
      this.currentUser.permission.editPosition = true;
      this.currentUser.permission.viewProjectList = true;
      this.currentUser.permission.createProject = true;
      this.currentUser.permission.editProject = true;
      this.currentUser.permission.viewSkillList = true;
      this.currentUser.permission.createSkill = true;
      this.currentUser.permission.editSkill = true;
      this.currentUser.permission.viewExperienceList = true;
      this.currentUser.permission.createExperience = true;
      this.currentUser.permission.editExperience = true;
      this.currentUser.permission.viewPriorityList = true;
      this.currentUser.permission.createPriority = true;
      this.currentUser.permission.editPriority = true;
      this.currentUser.permission.changeMyProfile = true;
      this.currentUser.permission.viewDepartmentList = true;
      this.currentUser.permission.createDepartment = true;
      this.currentUser.permission.viewRecruitmentTypeList = true;
      this.currentUser.permission.createRecruitmentType = true;
      this.currentUser.permission.editRecruitmentType = true;
      this.currentUser.permission.viewRecruitmentTypeList = true;
      this.currentUser.permission.viewCertificationList = true;
      this.currentUser.permission.createCertification = true;
      this.currentUser.permission.editCertification = true;
    }
    if (this.isHrMember()) {
      this.currentUser.permission.changeMyProfile = true;
      this.currentUser.permission.editRequest = true;
      this.currentUser.permission.viewRequestDetail = true;
      this.currentUser.permission.viewRequestList = true;
      this.currentUser.permission.viewRequestCenter = true;
      this.currentUser.permission.commentCandidate = true;
      this.currentUser.permission.changeCandidateStatus = true;
      this.currentUser.permission.createCandidate = true;
      this.currentUser.permission.createInterview = true;
      this.currentUser.permission.editInterview = true;
      this.currentUser.permission.rejectCandidate = true;
      this.currentUser.permission.editCv = true;
      this.currentUser.permission.viewCvList = true;
      this.currentUser.permission.createCv = true;
      this.currentUser.permission.viewCvDetail = true;
      this.currentUser.permission.viewInterviewList = true;
      this.currentUser.permission.viewInterviewDetail = true;
      this.currentUser.permission.viewReport = true;
      this.currentUser.permission.viewSkillList = true;
      this.currentUser.permission.createSkill = true;
      this.currentUser.permission.editSkill = true;
      this.currentUser.permission.viewCertificationList = true;
      this.currentUser.permission.createCertification = true;
      this.currentUser.permission.editCertification = true;
    }
  }

  setCurrentUser(currentUser: User) {
    this.currentUser = currentUser;
    this.saveCurrentUserToLocalStorage(currentUser);
    this.setUserPermision();
    this.currentUserChange$.next(this.currentUser);
  }

  setToken(token: Token) {
    this.token = token;
    this.saveTokenToLocalStorage(token);
  }
  private createHeaders() {
    return new HttpHeaders().set('Authorization', 'Bearer ' + this.token.access_token);
  }

  saveCurrentUserToLocalStorage(currentUser: User) {
    localStorage.setItem(LOCAL_STORAGE.CURRENT_USER, JSON.stringify(currentUser));
  }
  saveTokenToLocalStorage(token: Token) {
    localStorage.setItem(LOCAL_STORAGE.TOKENS, JSON.stringify(token));
  }

  isLoggedIn() {
    return this.currentUser !== null && this.token !== null;
  }
  isAdmin() {
    return this.getStringRoles().includes(ROLES.ADMIN);
  }
  isDuLead() {
    return this.getStringRoles().includes(ROLES.DU_LEAD);
  }
  isDuMember() {
    return this.getStringRoles().includes(ROLES.DU_MEMBER);
  }
  isHrManager() {
    return this.getStringRoles().includes(ROLES.HR_MANAGER);
  }
  isHrMember() {
    return this.getStringRoles().includes(ROLES.HR_MEMBER);
  }
  isGroupLead() {
    return this.getStringRoles().includes(ROLES.GROUP_LEAD);
  }
  isGroupDU(){
    return this.getStringGroups().includes('Delivery Unit')
  }
  isGroupBO(){
    return this.getStringGroups().includes('Back Office') || this.getStringGroups().includes('Sale') || this.getStringGroups().includes('QA')
  }

  getTopRole() {
    if (this.getStringRoles().includes(ROLES.ADMIN)) {
      return ROLES.ADMIN;
    }
    if (this.getStringRoles().includes(ROLES.DU_LEAD)) {
      return ROLES.DU_LEAD;
    }
    if (this.getStringRoles().includes(ROLES.DU_MEMBER)) {
      return ROLES.DU_MEMBER;
    }
    if (this.getStringRoles().includes(ROLES.HR_MANAGER)) {
      return ROLES.HR_MANAGER;
    }
    if (this.getStringRoles().includes(ROLES.HR_MEMBER)) {
      return ROLES.HR_MEMBER;
    }
    if (this.getStringRoles().includes(ROLES.GROUP_LEAD)) {
      return ROLES.GROUP_LEAD;
    }
  }
  getStringRoles(): string[] {
    return this.roles || [];
  }
  getStringGroups(): string[] {
    return this.groups || [];
  }

  removeIdentity() {
    localStorage.removeItem(LOCAL_STORAGE.CURRENT_USER);
    localStorage.removeItem(LOCAL_STORAGE.TOKENS);
    this.currentUser = null;
    this.token = null;
  }

}
