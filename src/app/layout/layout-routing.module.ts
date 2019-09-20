import { HrManagerGuard } from './../shared/guards/hr-manager.guard';
import { AdminGuard } from './../shared/guards/admin.guard';
import { LayoutComponent } from './layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DuLeadGuard } from '../shared/guards/du-lead.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'request',
        loadChildren: './../request-management/request-management.module#RequestManagementModule'
      },
      {
        path: 'interview',
        loadChildren: './../interview/interview.module#InterviewModule' },
      {
        path: 'cv',
        // canActivate: [HrManagerGuard],
        loadChildren: './../cv/cv.module#CvModule'
      },
      {
        path: 'user',
        // canActivate: [AdminGuard],
        loadChildren: './../admin/user/user.module#UserModule'
      },
      {
        path: 'report',
        loadChildren: './../report/report.module#ReportModule'
      },
      {
        path: 'config',
        // canActivate: [AdminGuard],
        loadChildren: './../admin/config/config.module#ConfigModule'
      },
      {
        path: '',
        loadChildren: './../request-management/request-management.module#RequestManagementModule',
        pathMatch: 'full'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
