import { ViewCertificationListGuard } from './guards/view-certification-list.guard';
import { CertificationComponent } from './certification.component';
import { NgModule } from '@angular/core';
import { CertificationCreateComponent } from './pages/certification-create/certification-create.component';
import { CertificationUpdateComponent } from './pages/certification-update/certification-update.component';
import { CertificationListComponent } from './pages/certification-list/certification-list.component';
import { CertificationService } from './services/certification.service';
import { SharedModule } from '../../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CertificationRoutingModule } from './certification.routing';

@NgModule({
  imports: [
    SharedModule,
    NgbModule,
    CertificationRoutingModule,
  ],
  declarations: [
    CertificationComponent,
    CertificationCreateComponent,
    CertificationUpdateComponent,
    CertificationListComponent
  ],
  providers: [
    CertificationService,
    ViewCertificationListGuard
  ],
  exports: [
    CertificationCreateComponent
  ]

})
export class CertificationModule { }
