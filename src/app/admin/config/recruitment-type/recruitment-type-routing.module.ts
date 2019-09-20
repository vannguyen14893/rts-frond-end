import { ViewRecruitmentTypeListGuard } from './guards/view-recruitment-type-list.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecruitmentTypeComponent } from './recruitment-type.component';
import { RecruitmentTypeListComponent } from './pages/recruitment-type-list/recruitment-type-list.component';

const routes: Routes = [
  {
    path: '',
    component: RecruitmentTypeComponent,
    children: [
      { path: 'list', component: RecruitmentTypeListComponent, canActivate: [ViewRecruitmentTypeListGuard] },
      { path: '', pathMatch: 'full', redirectTo: 'list' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecruitmentTypeRoutingModule { }
