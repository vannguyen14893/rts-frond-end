import { ViewReportGuard } from './guards/view-report.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportComponent } from './report.component';
import { ReportAmComponent } from './page/report-am/report-am.component';
import { ReportDuComponent } from './page/report-du/report-du.component';
import { ReportPinelineComponent } from './page/report-pineline/report-pineline.component';

const routes: Routes = [
  {
    path: '',
    component: ReportComponent,
    canActivate: [ViewReportGuard]
  },
  {
    path: 'am',
    component: ReportAmComponent,
    canActivate: [ViewReportGuard]
  },
  {
    path: 'am/search',
    component: ReportAmComponent,
    canActivate: [ViewReportGuard]
  },
  {
    path: 'du',
    component: ReportDuComponent,
    canActivate: [ViewReportGuard]
  },
  {
    path: 'du/search',
    component: ReportDuComponent,
    canActivate: [ViewReportGuard]
  },
  {
    path: 'pineline',
    component: ReportPinelineComponent,
    canActivate: [ViewReportGuard]
  },
  {
    path: 'pineline/search',
    component: ReportPinelineComponent,
    canActivate: [ViewReportGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
