import { ViewReportGuard } from './guards/view-report.guard';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report.component';
import { ReportHrmanagerComponent } from './page/report-hrmanager/report-hrmanager.component';
import { ReportService } from './service/report.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { ReportHrMemberComponent } from './page/report-hrmember/report-hrmember.component';
import { ReportAmComponent } from './page/report-am/report-am.component';
import { ReportDuComponent } from './page/report-du/report-du.component';
import { UserService } from '../admin/user/services/user.service';
import { ReportPinelineComponent } from './page/report-pineline/report-pineline.component';

@NgModule({
  imports: [
    SharedModule,
    ReportRoutingModule,
    NgbModule
  ],
  declarations: [
    ReportComponent,
    ReportHrmanagerComponent,
    ReportHrMemberComponent,
    ReportAmComponent,
    ReportDuComponent,
    ReportPinelineComponent,
  ],
  providers: [
   ReportService,
   UserService,
   ViewReportGuard
  ]
})
export class ReportModule { }
