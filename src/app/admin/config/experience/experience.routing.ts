import { ViewExperienceListGuard } from './guards/view-experience-list.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExperienceComponent } from './experience.component';
import { ExperienceListComponent } from './page/experience-list/experience-list.component';

const routes: Routes = [
    {
      path: '',
      component: ExperienceComponent,
      children: [
        { path: 'list', component: ExperienceListComponent, canActivate: [ViewExperienceListGuard] },
        { path: '', pathMatch: 'full', redirectTo: 'list' },
      ]
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ExperienceRoutingModule { }