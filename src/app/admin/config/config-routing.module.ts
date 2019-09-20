import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigHomeComponent } from './config-home/config-home.component';

const routes: Routes = [
  {
    path: 'candidate-status',
    loadChildren: './candidate-status/candidate-status.module#CandidateStatusModule'
  },
  {
    path: 'cv-status',
    loadChildren: './cv-status/cv-status.module#CvStatusModule'
  },
  {
    path: 'department',
    loadChildren: './department/department.module#DepartmentModule'
  },
  {
    path: 'experience',
    loadChildren: './experience/experience.module#ExperienceModule'
  },
  {
    path: 'position',
    loadChildren: './position/position.module#PositionModule'
  },
  {
    path: 'priority',
    loadChildren: './priority/priority.module#PriorityModule'
  },
  {
    path: 'project',
    loadChildren: './project/project.module#ProjectModule'
  },
  {
    path: 'recruitment-type',
    loadChildren: './recruitment-type/recruitment-type.module#RecruitmentTypeModule'
  },
  {
    path: 'request-status',
    loadChildren: './request-status/request-status.module#RequestStatusModule'
  },
  {
    path: 'skill',
    loadChildren: './skill/skill.module#SkillModule'
  },
  {
    path: 'certification',
    loadChildren: './certification/certification.module#CertificationModule'
  },
  {
    path: 'global-account',
    loadChildren: './global-account/global-account.module#GlobalAccountModule'
  },
  {
    path: '',
    component: ConfigHomeComponent,
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule { }
