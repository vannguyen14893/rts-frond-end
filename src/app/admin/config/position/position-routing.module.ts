import { ViewPositionListGuard } from './guards/view-position-list.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PositionListComponent } from './pages/position-list/position-list.component';
import { PositionComponent } from './position.component';

const routes: Routes = [
  {
    path: '',
    component: PositionComponent,
    children: [
      { path: 'list', component: PositionListComponent, canActivate: [ViewPositionListGuard] },
      { path: '', pathMatch: 'full', redirectTo: 'list' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PositionRoutingModule { }
