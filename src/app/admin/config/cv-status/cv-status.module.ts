import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { CvStatusRoutingModule } from './cv-status-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CvStatusComponent } from './cv-status.component';
import { CvStatusService } from './service/cv-status.service';
import { CvStatusCreateComponent } from './pages/cv-status-create/cv-status-create.component';
import { CvStatusUpdateComponent } from './pages/cv-status-update/cv-status-update.component';
import { CvStatusListComponent } from './pages/cv-status-list/cv-status-list.component';

@NgModule({
  imports: [
    SharedModule,
    CvStatusRoutingModule,
    NgbModule
  ],
  declarations: [
    CvStatusComponent,
    CvStatusCreateComponent,
    CvStatusUpdateComponent,
    CvStatusListComponent],
  exports: [
    CvStatusComponent
  ],
  providers: [CvStatusService]
})
export class CvStatusModule { }
