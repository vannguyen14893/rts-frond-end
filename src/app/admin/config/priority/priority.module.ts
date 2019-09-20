import { ViewPriorityListGuard } from './guards/view-priority-list.guard';
import { PriorityRoutingModule } from './priority.routing';
import { PriorityService } from './service/priority.service';
import { PriorityComponent } from './priority.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { PriorityListComponent } from './page/priority-list/priority-list.component';
import { PriorityCreateComponent } from './page/priority-create/priority-create.component';
import { PriorityUpdateComponent } from './page/priority-update/priority-update.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    NgbModule,
    SharedModule,
    PriorityRoutingModule,
  ],
  declarations: [
    PriorityComponent,
    PriorityListComponent,
    PriorityCreateComponent,
    PriorityUpdateComponent],
  providers: [
    PriorityService,
    ViewPriorityListGuard
  ]
})
export class PriorityModule { }
