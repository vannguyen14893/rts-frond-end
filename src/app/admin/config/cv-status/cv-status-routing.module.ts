import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CvStatusComponent } from './cv-status.component';
import { CvStatusListComponent } from './pages/cv-status-list/cv-status-list.component';

const routes: Routes = [
  {
    path: '',
    component: CvStatusComponent,
    children: [
      { path: 'list', component: CvStatusListComponent },
      { path: '', pathMatch: 'full', redirectTo: 'list' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CvStatusRoutingModule { }
