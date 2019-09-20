import { Component, OnInit } from '@angular/core';
import { User } from './../../../model/user.class';
import { IdentityService } from './../../../core/services/identity.service';

@Component({
  selector: 'app-config-home',
  templateUrl: './config-home.component.html',
  styleUrls: ['./config-home.component.css']
})
export class ConfigHomeComponent implements OnInit {

  canViewDepartment = false;
  canViewExperience = false;
  canViewPosition = false;
  canViewPriority = false;
  canViewProject = false;
  canViewRecruitmentType = false;
  canViewSkill = false;
  canViewCertification = false;
  currentUser: User;
  constructor(
    private identityService: IdentityService
  ) {}

  ngOnInit() {
    this.currentUser = this.identityService.getCurrentUser();

    this.canViewPosition = this.currentUser.permission.viewPositionList;
    this.canViewPriority = this.currentUser.permission.viewPriorityList;
    this.canViewProject = this.currentUser.permission.viewProjectList;
    this.canViewDepartment = this.currentUser.permission.viewDepartmentList;
    this.canViewRecruitmentType = this.currentUser.permission.viewRecruitmentTypeList;
    this.canViewExperience = this.currentUser.permission.viewExperienceList;
    this.canViewSkill = this.currentUser.permission.viewSkillList;
    this.canViewCertification = this.currentUser.permission.viewCertificationList;
  }

}
