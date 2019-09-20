import { ViewMyProfileGuard } from './guards/view-my-profile.guard';
import { ViewUserListGuard } from './guards/view-user-list.guard';
import { ViewUserDetailGuard } from './guards/view-user-detail.guard';
import { CreateUserGuard } from './guards/create-user.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserCreateComponent } from './pages/user-create/user-create.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserUpdateComponent } from './pages/user-update/user-update.component';
import { UserComponent } from './user.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: 'create', component: UserCreateComponent, canActivate: [CreateUserGuard] },
      { path: 'detail', component: UserDetailComponent, canActivate: [ViewMyProfileGuard] },
      { path: 'list', component: UserListComponent, canActivate: [ViewUserListGuard] },
      { path: ':id', component: UserUpdateComponent, canActivate: [ViewUserDetailGuard] },
      { path: '', pathMatch: 'full', redirectTo: 'list' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
