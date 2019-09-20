import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/shared.module';
import { ViewPositionListGuard } from './guards/view-position-list.guard';
import { PositionCreateComponent } from './pages/position-create/position-create.component';
import { PositionListComponent } from './pages/position-list/position-list.component';
import { PositionUpdateComponent } from './pages/position-update/position-update.component';
import { PositionRoutingModule } from './position-routing.module';
import { PositionComponent } from './position.component';
import { PositionService } from './services/position.service';

@NgModule({
  imports: [
    PositionRoutingModule,
    SharedModule,
    NgbModule
  ],
  declarations: [
    PositionComponent,
    PositionCreateComponent,
    PositionUpdateComponent,
    PositionListComponent,
  ],
  exports: [
    PositionComponent,
    PositionCreateComponent
  ],
  providers: [
    PositionService,
    ViewPositionListGuard
  ]
})
export class PositionModule { }
