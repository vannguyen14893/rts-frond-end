import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared/shared.module';
import { DepartmentRoutingModule } from './department-routing.module';
import { DepartmentComponent } from './department.component';
import { DepartmentCreateComponent } from './pages/department-create/department-create.component';
import { DepartmentListComponent } from './pages/department-list/department-list.component';
import { DepartmentUpdateComponent } from './pages/department-update/department-update.component';
import { DepartmentService } from './service/department.service';
import { CreateDepartmentGuard } from './guards/create-department.guard';
import { ViewDepartmentListGuard } from './guards/view-department-list.guard';
import { EditDepartmentGuard } from './guards/edit-department.guard';

@NgModule({
  imports: [
    SharedModule,
    DepartmentRoutingModule,
    NgbModule,
    NgbTooltipModule,
  ],
  declarations: [
    DepartmentComponent,
    DepartmentListComponent,
    DepartmentCreateComponent,
    DepartmentUpdateComponent,
  ],
  exports: [
    DepartmentCreateComponent
  ],
  providers: [
    DepartmentService,
    CreateDepartmentGuard,
    ViewDepartmentListGuard,
    EditDepartmentGuard
  ]
})
export class DepartmentModule { }
