import { ViewRequestCenterGuard } from './guards/view-request-center.guard';
import { ViewRequestDetailGuard } from './guards/view-request-detail.guard';
import { RequestManagementCreateComponent } from './pages/request-management-create/request-management-create.component';
import { RequestManagementComponent } from './request-management.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestCenterComponent } from './pages/request-center/request-center.component';
import { RequestManagementDetailComponent } from './pages/request-management-detail/request-management-detail.component';
import { HomeComponent } from './pages/home/home.component';
import { CreateRequestGuard } from './guards/create-request.guard';
import { CreateRequestDeactiveGuard } from './guards/create-request.deactive.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: '',
    component: RequestManagementComponent,
    children: [
      {
        path: 'search',
        component: HomeComponent,
      },
      {
        path: 'create',
        component: RequestManagementCreateComponent,
        canActivate: [CreateRequestGuard],
        canDeactivate: [CreateRequestDeactiveGuard],
      },
      { path: ':id/detail', component: RequestManagementDetailComponent, canActivate: [ViewRequestDetailGuard] },
      { path: ':id', component: RequestCenterComponent, canActivate: [ViewRequestCenterGuard] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestManagementRoutingModule { }
