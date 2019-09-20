import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateStatusComponent } from './candidate-status.component';
import { CandidateStatusListComponent } from './pages/candidate-status-list/candidate-status-list.component';

const routes: Routes = [
  {
    path: '',
    component: CandidateStatusComponent,
    children: [
      { path: 'list', component: CandidateStatusListComponent },
      { path: '', pathMatch: 'full', redirectTo: 'list' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateStatusRoutingModule { }
