import { ViewPriorityListGuard } from './guards/view-priority-list.guard';
import { PriorityListComponent } from './page/priority-list/priority-list.component';
import { PriorityComponent } from './priority.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
      path: '',
      component: PriorityComponent,
      children: [
        { path: 'list', component: PriorityListComponent, canActivate: [ViewPriorityListGuard] },
        { path: '', pathMatch: 'full', redirectTo: 'list' },
      ]
    }
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class PriorityRoutingModule { }