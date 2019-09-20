import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CandidateStatusComponent } from './candidate-status.component';
import { CandidateStatusService } from './service/candidate-status.service';
import { CandidateStatusCreateComponent } from './pages/candidate-status-create/candidate-status-create.component';
import { CandidateStatusUpdateComponent } from './pages/candidate-status-update/candidate-status-update.component';
import { CandidateStatusListComponent } from './pages/candidate-status-list/candidate-status-list.component';
import { CandidateStatusRoutingModule } from './candidate-status.routing';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    CandidateStatusRoutingModule,
    NgbModule
  ],
  declarations: [
    CandidateStatusComponent,
    CandidateStatusCreateComponent,
    CandidateStatusUpdateComponent,
    CandidateStatusListComponent
  ],
  exports: [
    CandidateStatusComponent
  ],
  providers: [CandidateStatusService]
})
export class CandidateStatusModule { }
