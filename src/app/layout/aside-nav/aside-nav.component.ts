import { IdentityService } from '../../core/services/identity.service';
import { Component, OnInit } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

import { NavigationService } from '../../core/services/navigation.service';

declare let mLayout: any;

@Component({
  selector: 'app-aside-nav',
  templateUrl: './aside-nav.component.html',
  styleUrls: ['./aside-nav.component.css']
})
export class AsideNavComponent implements OnInit, AfterViewInit {
  isAdmin = false;
  isDuLead = false;
  isDuMember = false;
  isHrManager = false;
  isHrMember = false;
  constructor(
    private navigationService: NavigationService,
    private identityService: IdentityService
  ) { 
    this.isAdmin = this.identityService.isAdmin();
    this.isDuLead = this.identityService.isDuLead();
    this.isDuMember = this.identityService.isDuMember();
    this.isHrManager = this.identityService.isHrManager();
    this.isHrMember = this.identityService.isHrMember();
  }

  ngOnInit() {
  }
  ngAfterViewInit() {

    mLayout.initAside();
    const menu = mLayout.getAsideMenu();
    const item = $(menu)
      .find('a[href="' + window.location.pathname + '"]')
      .parent('.m-menu__item');
    (<any>$(menu).data('menu')).setActiveItem(item);
  }

  navRequestList() {
    this.navigationService.navRequestList();
  }
  navRequestCreate() {
    this.navigationService.navRequestCreate();
  }

  navUserList() {
    this.navigationService.navUserList();
  }
  navUserCreate() {
    this.navigationService.navUserCreate();
  }

  navCvList() {
    this.navigationService.navCvList();
  }
  navCvCreate() {
    this.navigationService.navCvCreate();
  }

  navInterviewList() {
    this.navigationService.navInterviewList();
  }
  navInterviewCreate() {
    this.navigationService.navInterviewCreate();
  }

  navReportList() {
    this.navigationService.navReportList();
  }
  navReportCreate() {
    this.navigationService.navReportCreate();
  }

  navDepartmentList() {
    this.navigationService.navDepartmentList();
  }
  navDepartmentCreate() {
    this.navigationService.navDepartmentCreate();
  }

  navPositionList() {
    this.navigationService.navPositionList();
  }
  navPositionCreate() {
    this.navigationService.navPositionCreate();
  }

  //add
  navRecruimentList() {
    this.navigationService.navRecruimentList();
  }

  navRequestStatusList() {
    this.navigationService.navRequestStatusList();
  }

  navCVStatusList() {
    this.navigationService.navCvStatusList();
  }


  navSkillList() {
    this.navigationService.navSkillList();
  }
  navSkillCreate() {
    this.navigationService.navSkillCreate();
  }

  navCandidateList() {
    this.navigationService.navCandidateList();
  }
  navCandidateCreate() {
    this.navigationService.navCandidateCreate();
  }

  navPriorityList() {
    this.navigationService.navPriorityList();
  }

  navProjectList() {
    this.navigationService.navProjectList();
  }

  navExperienceList() {
    this.navigationService.navExperienceList();
  }

  navCandidateStatusList() {
    this.navigationService.navCandidateStatusList();
  }
}
