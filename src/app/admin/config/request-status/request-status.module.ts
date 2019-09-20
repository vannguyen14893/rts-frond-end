import { NgModule } from '@angular/core';
import { RequestStatusUpdateComponent } from './pages/request-status-update/request-status-update.component';
import { RequestStatusCreateComponent } from './pages/request-status-create/request-status-create.component';
import { RequestStatusListComponent } from './pages/request-status-list/request-status-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RequestStatusRoutingModule } from './request-status-routing.module';
import { RequestStatusComponent } from './request-status.component';
import { RequestStatusService } from './service/request-status.service';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    RequestStatusRoutingModule,
    NgbModule
  ],
  declarations: [
    RequestStatusComponent,
    RequestStatusUpdateComponent,
    RequestStatusCreateComponent,
    RequestStatusListComponent],
    exports: [
      RequestStatusComponent
    ],
    providers: [RequestStatusService]
})
export class RequestStatusModule { }
