import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestStatusListComponent } from './pages/request-status-list/request-status-list.component';
import { RequestStatusComponent } from './request-status.component';

const routes: Routes = [
  {
    path: '',
    component: RequestStatusComponent,
    children: [
      { path: 'list', component: RequestStatusListComponent },
      { path: '', pathMatch: 'full', redirectTo: 'list' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestStatusRoutingModule { }
