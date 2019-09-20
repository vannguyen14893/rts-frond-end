import { ViewInterviewDetailGuard } from './guards/view-interview-detail.guard';
import { CreateInterviewGuard } from './guards/create-interview.guard';
import { ViewInterviewListGuard } from './guards/view-interview-list.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InterviewComponent } from './interview.component';
import { InterviewCreateComponent } from './pages/interview-create/interview-create.component';
import { InterviewDetailComponent } from './pages/interview-detail/interview-detail.component';
import { InterviewListComponent } from './pages/interview-list/interview-list.component';

const routes: Routes = [
  {
    path: '',
    component: InterviewComponent,
    children: [
      { path: 'create', component: InterviewCreateComponent, canActivate: [CreateInterviewGuard] },
      { path: 'detail/:id', component: InterviewDetailComponent, canActivate: [ViewInterviewDetailGuard] },
      { path: 'list', component: InterviewListComponent, canActivate: [ViewInterviewListGuard] },
      { path: 'search', component: InterviewListComponent, canActivate: [ViewInterviewListGuard] },
      { path: '', pathMatch: 'full', redirectTo: 'list' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterviewRoutingModule { }
