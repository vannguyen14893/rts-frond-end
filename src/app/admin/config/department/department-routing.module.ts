import { CreateDepartmentGuard } from './guards/create-department.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DepartmentComponent } from './department.component';
import { DepartmentCreateComponent } from './pages/department-create/department-create.component';
import { DepartmentListComponent } from './pages/department-list/department-list.component';
import { DepartmentUpdateComponent } from './pages/department-update/department-update.component';
import { EditDepartmentGuard } from './guards/edit-department.guard';
import { ViewDepartmentListGuard } from './guards/view-department-list.guard';

const routes: Routes = [
  {
    path: '',
    component: DepartmentComponent,
    children: [
      { path: 'create', component: DepartmentCreateComponent, canActivate: [CreateDepartmentGuard] },
      { path: 'update', component: DepartmentUpdateComponent, canActivate: [EditDepartmentGuard] },
      { path: 'list', component: DepartmentListComponent, canActivate: [ViewDepartmentListGuard] },
      { path: '', pathMatch: 'full', redirectTo: 'list' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentRoutingModule { }
