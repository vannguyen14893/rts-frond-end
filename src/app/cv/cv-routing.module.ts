import { ViewCvDetailGuard } from './guards/view-cv-detail.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CvComponent } from './cv.component';
import { ViewCvListGuard } from './guards/view-cv-list.guard';
import { CvCreateComponent } from './pages/cv-create/cv-create.component';
import { CvDetailComponent } from './pages/cv-detail/cv-detail.component';
import { CvListV2Component } from './pages/cv-list-v2/cv-list-v2.component';
import { CreateCvGuard } from './guards/create-cv.guard';
import { CandidateDetailComponent } from './pages/candidate-detail/candidate-detail.component';


const routes: Routes = [
  {
    path: '',
    component: CvComponent,
    children: [
      { path: 'create', component: CvCreateComponent, canActivate: [CreateCvGuard] },
      { path: 'search', component: CvListV2Component, canActivate: [ViewCvListGuard] },
      { path: 'list', component: CvListV2Component, canActivate: [ViewCvListGuard] },
      { path: ':id', component: CvDetailComponent, canActivate: [ViewCvDetailGuard] },
      { path: 'candidate/:id', component: CandidateDetailComponent, canActivate: [ViewCvDetailGuard] },
      { path: '', pathMatch: 'full', redirectTo: 'list' },
    ]
  },


];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [

  ]
})
export class CvRoutingModule { }
