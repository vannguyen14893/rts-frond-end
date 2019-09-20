import { AuthGuard } from './auth/guards/auth.guard';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";

export const routes: Routes = [
  { 
    path: "auth",
    loadChildren: "./auth/auth.module#AuthModule" },
  {
    path: 'error',
    loadChildren: './error/error.module#ErrorModule'
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: './layout/layout.module#LayoutModule'
  },
  {
    path: '**',
    redirectTo: '/'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
