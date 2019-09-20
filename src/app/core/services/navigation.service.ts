import { IdentityService } from './identity.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class NavigationService {

  constructor(
    private router: Router,
    private identityService: IdentityService,
  ) { }

  navHomepage() {
    // if (this.identityService.isAdmin()) {
    //   this.navUserList();
    // } else if (this.identityService.isDuLead()) {
    //   this.navRequestList();
    // } else if (this.identityService.isDuMember()) {
    //   this.navRequestList();
    // } else if (this.identityService.isHrManager()) {
    //   this.navRequestHomeHrManager();
    // } else if (this.identityService.isHrMember()) {
    //   this.navRequestHomeHrManager();
    // } else if (this.identityService.isGroupLead()) {
    //   this.navRequestList();
    // } else {
    //   this.navLogin();
    // }
    /**
     * vdhoan fix nav home page
     */
    if (this.identityService.isLoggedIn()) {
      this.router.navigateByUrl('/');
    } else {
      this.navLogin();
    }
  }

  navLogin() {
    this.router.navigateByUrl('/auth/login');
  }

  navMyProfile() {
    this.router.navigateByUrl('/user/detail');
  }
  navConfig() {
    this.router.navigateByUrl('/config');
  }

  // Request page navigations
  navRequestHomeHrManager() {
    this.router.navigateByUrl('/request/approved');
  }
  navRequestList() {
    this.router.navigateByUrl('/request');
  }
  navRequestCreate() {
    this.router.navigateByUrl('/request/create');
  }
  navRequestCenterDetail(id: number) {
    this.router.navigateByUrl('/request/' + id);
  }
  navRequestDetail(id: number) {
    this.router.navigateByUrl('/request/' + id + '/detail');
  }
  navInterviewsOfRequest(id: number) {
    this.router.navigateByUrl('/request/' + id + '/interviews');
  }
  navForgotPassword() {
    this.router.navigateByUrl('/auth/forgot-password');
  }

  // User page navigation for admin only
  navUserList() {
    if (this.identityService.isAdmin()) {
      this.router.navigateByUrl('/user');
    } else {
      console.log('You are not authorized');
    }
  }
  navUserCreate() {
    if (this.identityService.isAdmin()) {
      this.router.navigateByUrl('/user/create');
    } else {
      console.log('You are not authorized');
    }
  }

  navUserDetail(id: number) {
    if (this.identityService.isAdmin()) {
      this.router.navigateByUrl('/user/' + id);
    } else {
      console.log('You are not authorized');
    }
  }

  // Cv page navigations
  navCvList() {
    this.router.navigateByUrl('/cv');
  }
  navCvDetail(id: number) {
    this.router.navigateByUrl('/cv/' + id);
  }
  navCvCreate() {
    this.router.navigateByUrl('/cv/create');
  }
  navCvUpdate(id: number) {
    this.router.navigateByUrl('/cv/' + id + '/update');
  }

  // Candidate page navigation
  navCandidateList() {
    this.router.navigateByUrl('/candidate');
  }
  navCandidateCreate(cvId?) {
    if (cvId) {
      this.router.navigateByUrl('/candidate/create/' + cvId);
    } else {
      this.router.navigateByUrl('/candidate/create');
    }
  }
  navCandidateDetail(id: number) {
    this.router.navigateByUrl('/cv/candidate/' + id);
  }
  navCandidateUpdate(id: number) {
    this.router.navigateByUrl('/candidate/' + id + '/update');
  }

  // Inteview page navigation
  navInterviewList() {
    this.router.navigateByUrl('/interview');
  }
  navInterviewCreate() {
    this.router.navigateByUrl('/interview/create');
  }
  navInterviewDetail(id: number) {
    this.router.navigateByUrl('/interview/detail/' + id);
  }
  navInterviewToComment(id: number) {
    this.router.navigate(['/interview/detail/' + id, { comment: 'true' }]);
  }
  navInterviewUpdate(id: number) {
    this.router.navigateByUrl('/interview/' + id + '/update');
  }
  navInterviewCreateWithCandidate(id) {
    this.router.navigateByUrl('/interview/create?candidateId=' + id);
  }

  // Report page navigation
  navReportList() {
    this.router.navigateByUrl('/report');
  }
  navReportCreate() {
    this.router.navigateByUrl('/report/create');
  }
  navReportDetail(id: number) {
    this.router.navigateByUrl('/report/' + id);
  }
  navReportUpdate(id: number) {
    this.router.navigateByUrl('/report/' + id + '/update');
  }

  // Department page navigation
  navDepartmentList() {
    this.router.navigateByUrl('/department');
  }
  navDepartmentCreate() {
    this.router.navigateByUrl('/department/create');
  }
  navDepartmentDetail(id: number) {
    this.router.navigateByUrl('/department/' + id);
  }
  navDepartmentUpdate(id: number) {
    this.router.navigateByUrl('/department/' + id + '/update');
  }

  // Position page navigation
  navPositionList() {
    this.router.navigateByUrl('/position');
  }
  navPositionCreate() {
    this.router.navigateByUrl('/position/create');
  }
  navPositionDetail(id: number) {
    this.router.navigateByUrl('/position/' + id);
  }
  navPositionUpdate(id: number) {
    this.router.navigateByUrl('/position/' + id + '/update');
  }

  // Recruiment page navigation
  navRecruimentList() {
    this.router.navigateByUrl('/recruitment-type');
  }

  // Request status page navigation
  navRequestStatusList() {
    this.router.navigateByUrl('/request-status');
  }


  // cv status page navigation
  navCvStatusList() {
    this.router.navigateByUrl('/cv-status');
  }


  // Skill page navigation
  navSkillList() {
    this.router.navigateByUrl('/skill');
  }
  navSkillCreate() {
    this.router.navigateByUrl('/skill/create');
  }
  navSkillDetail(id: number) {
    this.router.navigateByUrl('/skill/' + id);
  }
  navSkillUpdate(id: number) {
    this.router.navigateByUrl('/skill/' + id + '/update');
  }

  navErrorNotFound() {
    this.router.navigateByUrl('/error/not-found');
  }
  navErrorUnauthorized() {
    this.router.navigateByUrl('/error/unauthorized');
  }
  navErrorGeneral() {
    this.router.navigateByUrl('/error/general');
  }

  navListCandidateByRequestId(id) {
    this.router.navigateByUrl('/candidate/list/request/' + id);
  }

  navListCandidateByRequestIdAndStatusId(requestId, statusId) {
    this.router.navigateByUrl('/candidate/list/request/' + requestId + '/' + statusId);
  }

  navPriorityList() {
    this.router.navigateByUrl('/priority');
  }

  navProjectList() {
    this.router.navigateByUrl('/project');
  }

  navExperienceList() {
    this.router.navigateByUrl('/experience');
  }

  navRecruitmentTypeList() {
    this.router.navigateByUrl('/recruitment-type');
  }

  navCandidateStatusList() {
    this.router.navigateByUrl('/candidate-status');
  }

  navRequestSearchListWithParam(param) {
    this.router.navigate(['/request/search'], {
      queryParams: {
        requestStatusId: param.requestStatusId.toString(),
        priorityId: param.priorityId,
        departmentId: param.departmentId.toString(),
        assigneeId: param.assigneeId,
        groupId: param.groupId,
        title: param.title,
        page: param.page,
        size: param.size,
        sort: param.sort
      }
    })
  }

  navCvSearchListWithParam(param) {
    this.router.navigate(['/cv/search'], {
      queryParams: {
        input: param.input,
        hrId: param.hrId,
        requestId: param.requestId,
        skillId: param.skillId.toString(),
        experienceId: param.experienceId.toString(),
        statusId: param.statusId.toString(),
        certificationId: param.certificationId.toString(),
        requestIdOfCandidate: param.requestIdOfCandidate,
        page: param.page,
        size: param.size,
        sort: param.sort,
      }
    });
  }

  navInterviewSearchListWithParam(param) {
    this.router.navigate(['/interview/search'], {
      queryParams: {

      }
    });
  }

  navPinelineReportSearchWithParam(param) {
    this.router.navigate(['/report/pineline/search'], {
      queryParams: {
        fromDate: (param.fromDate === "Invalid Date") ? "" : param.fromDate,
        toDate: (param.toDate === "Invalid Date") ? "" : param.toDate,
        page: param.page,
        size: param.size,
        sort: param.sort,
      }
    });
  }

  navAmReportSearchWithParam(param) {
    this.router.navigate(['/report/am/search'], {
      queryParams: {
        fromDate: (param.fromDate === "Invalid Date") ? "" : param.fromDate,
        toDate: (param.toDate === "Invalid Date") ? "" : param.toDate,
        hrmemberId: param.hrmemberId,
        page: param.page,
        size: param.size,
        sort: param.sort,
      }
    });
  }

  navDuReportSearchWithParam(param) {
    this.router.navigate(['/report/du/search'], {
      queryParams: {
        year: param,
      }
    });
  }
}
