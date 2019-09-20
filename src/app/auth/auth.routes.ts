import { ForgotPasswordFormComponent } from './components/forgot-password-form/forgot-password.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth.component';
import { LoginComponent } from './pages/login/login.component';


const routes: Routes = [
    { 
      path: '',
      component: AuthComponent,
      children: [
        { path: 'login', component: LoginComponent },
        { path: 'forgot-password', component: ForgotPasswordFormComponent },
        { path: '', pathMatch: 'full', redirectTo: 'login' },
      ]
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class AuthRoutingModule { }
