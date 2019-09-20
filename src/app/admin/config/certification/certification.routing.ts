import { ViewCertificationListGuard } from './guards/view-certification-list.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CertificationComponent } from './certification.component';
import { CertificationListComponent } from './pages/certification-list/certification-list.component';

const routes: Routes = [
    {
      path: '',
      component: CertificationComponent,
      children: [
        { path: 'list', component: CertificationListComponent, canActivate: [ViewCertificationListGuard] },
        { path: '', pathMatch: 'full', redirectTo: 'list' },
      ]
    }
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class CertificationRoutingModule { }
