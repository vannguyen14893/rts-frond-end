import { ForgotPasswordFormComponent } from './components/forgot-password-form/forgot-password.component';
import { AuthRoutingModule } from './auth.routes';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './pages/login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NavigationService } from '../core/services/navigation.service';
import { LoginService } from './services/login.service';
import { ResetPasswordService } from './services/reset-password.service';

@NgModule({
  imports: [
    SharedModule,
    AuthRoutingModule,
  ],
  declarations: [
    AuthComponent,
    LoginComponent,
    ForgotPasswordFormComponent
  ],
  providers: [
    LoginService,
    ResetPasswordService,
  ]
})
export class AuthModule { }
