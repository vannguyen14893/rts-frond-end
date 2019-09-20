import { ErrorComponent } from './error.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorRoutingModule } from './error-routing.module';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { GeneralComponent } from './pages/general/general.component';

@NgModule({
  imports: [
    CommonModule,
    ErrorRoutingModule
  ],
  declarations: [
    ErrorComponent,
    NotFoundComponent,
    UnauthorizedComponent,
    GeneralComponent
  ]
})
export class ErrorModule { }
