import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GlobalAccountComponent } from './global-account.component';
import { CreateComponent } from './pages/create/create.component';
import { GlobalAccountCreateGuard } from './guards/global-account-create.guard';


const routes: Routes = [
  {
    path: '',
    component: GlobalAccountComponent,
    children: [
      { path: 'create', component: CreateComponent},
      { path: '', pathMatch: 'full', redirectTo: 'create' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GlobalAccountRoutingModule { }
