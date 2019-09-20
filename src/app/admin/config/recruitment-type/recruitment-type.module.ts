import { ViewRecruitmentTypeListGuard } from './guards/view-recruitment-type-list.guard';
import { NgModule } from '@angular/core';
import { RecruitmentTypeComponent } from './recruitment-type.component';
import { RecruitmentTypeListComponent } from './pages/recruitment-type-list/recruitment-type-list.component';
import { RecruitmentTypeCreateComponent } from './pages/recruitment-type-create/recruitment-type-create.component';
import { RecruitmentTypeUpdateComponent } from './pages/recruitment-type-update/recruitment-type-update.component';
import { RecruitmentTypeService } from './service/recruitment-type.service';
import { RecruitmentTypeRoutingModule } from './recruitment-type-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    RecruitmentTypeRoutingModule,
    SharedModule,
    NgbModule
  ],
  declarations: [
    RecruitmentTypeComponent,
    RecruitmentTypeListComponent,
    RecruitmentTypeCreateComponent,
    RecruitmentTypeUpdateComponent
  ],
  exports: [
    RecruitmentTypeCreateComponent
  ],
  providers: [
    RecruitmentTypeService,
    ViewRecruitmentTypeListGuard
  ]
})
export class RecruitmentTypeModule { }
