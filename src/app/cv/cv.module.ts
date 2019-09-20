import { ViewCvDetailGuard } from './guards/view-cv-detail.guard';
import { CreateCvGuard } from './guards/create-cv.guard';
import { CvService } from './service/cv.service';
import { CvComponent } from './cv.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CvRoutingModule } from './cv-routing.module';
import { CvCreateComponent } from './pages/cv-create/cv-create.component';
import { CvDetailComponent } from './pages/cv-detail/cv-detail.component';
import { CvListComponent } from './pages/cv-list/cv-list.component';
import { SkillService } from '../admin/config/skill/services/skill.service';
import { SkillModule } from '../admin/config/skill/skill.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CvListV2Component } from './pages/cv-list-v2/cv-list-v2.component';
import { ActionCreatorService } from '../core/services/action-creator.service';
import { ViewCvListGuard } from './guards/view-cv-list.guard';
import { RequestManagementService } from '../request-management/services/request-management.service';
import { GetAllService } from '../core/services/get-all.service';
import { CandidateDetailComponent } from './pages/candidate-detail/candidate-detail.component';
import { CertificationService } from '../admin/config/certification/services/certification.service';

@NgModule({
  imports: [
    SharedModule,
    CvRoutingModule,
    SkillModule,
    NgbModule,
  ],
  declarations: [
    CvCreateComponent,
    CvDetailComponent,
    CvListComponent,
    CvComponent,
    CvListV2Component,
    CandidateDetailComponent,
  ],
  providers: [
    CvService,
    SkillService,
    ActionCreatorService,
    ViewCvListGuard,
    CreateCvGuard,
    ViewCvDetailGuard,
    RequestManagementService,
    GetAllService,
    CertificationService
  ],
  exports: [
    CvDetailComponent,
    CvListComponent,
    CvListV2Component
  ]
})
export class CvModule { }
