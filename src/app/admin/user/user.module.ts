import { ViewUserDetailGuard } from './guards/view-user-detail.guard';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { UserCreateComponent } from './pages/user-create/user-create.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserUpdateComponent } from './pages/user-update/user-update.component';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { UserService } from './services/user.service';
import { ChangePasswordFormComponent } from './components/change-password-form/change-password-form.component';
import { UpdateProfileFormComponent } from './components/update-profile-form/update-profile-form.component';
import { GetAllService } from '../../core/services/get-all.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentModule } from '../config/department/department.module';
import { SetActiveComponent } from './components/set-active/set-active.component';
import { CvService } from '../../cv/service/cv.service';
import { ViewUserListGuard } from './guards/view-user-list.guard';
import { CreateUserGuard } from './guards/create-user.guard';
import { ViewMyProfileGuard } from './guards/view-my-profile.guard';

@NgModule({
  imports: [
    UserRoutingModule,
    SharedModule,
    NgbModule,
    DepartmentModule
  ],
  declarations: [
    UserComponent,
    UserCreateComponent,
    UserUpdateComponent,
    UserDetailComponent,
    UserListComponent,
    ChangePasswordFormComponent,
    UpdateProfileFormComponent,
    SetActiveComponent,
  ],
  providers: [
    UserService,
    GetAllService,
    ViewUserListGuard,
    ViewUserDetailGuard,
    CreateUserGuard,
    ViewMyProfileGuard
  ],
  exports: [
    UserListComponent
  ]
})
export class UserModule { }
