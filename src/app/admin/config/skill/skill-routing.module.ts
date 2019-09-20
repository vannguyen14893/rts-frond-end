import { CreateDepartmentGuard } from '../department/guards/create-department.guard';
import { ViewSkillListGuard } from './guards/view-skill-list.guard';
import { SkillListComponent } from './pages/skill-list/skill-list.component';
import { SkillUpdateComponent } from './pages/skill-update/skill-update.component';
import { SkillComponent } from './skill.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SkillCreateComponent } from './pages/skill-create/skill-create.component';
import { EditSkillGuard } from './guards/edit-skill.guard';

const routes: Routes = [
  {
    path: '',
    component: SkillComponent,
    children: [
      { path: 'create', component: SkillCreateComponent, canActivate: [CreateDepartmentGuard] },
      { path: 'update', component: SkillUpdateComponent, canActivate: [EditSkillGuard] },
      { path: 'list', component: SkillListComponent, canActivate: [ViewSkillListGuard] },
      { path: '', pathMatch: 'full', redirectTo: 'list' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillRoutingModule { }
