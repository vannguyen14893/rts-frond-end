import { GeneralComponent } from './pages/general/general.component';
import { ErrorComponent } from './error.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';

const routes: Routes = [
  { 
    path: '',
    component: ErrorComponent,
    children: [
      { path: 'not-found', component: NotFoundComponent},
      { path: 'unauthorized', component: UnauthorizedComponent},
      { path: 'general', component: GeneralComponent},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorRoutingModule { }
