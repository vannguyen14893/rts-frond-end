import { EditSkillGuard } from './guards/edit-skill.guard';
import { ViewSkillListGuard } from './guards/view-skill-list.guard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared/shared.module';
import { SkillCreateComponent } from './pages/skill-create/skill-create.component';
import { SkillListComponent } from './pages/skill-list/skill-list.component';
import { SkillUpdateComponent } from './pages/skill-update/skill-update.component';
import { SkillRoutingModule } from './skill-routing.module';
import { SkillComponent } from './skill.component';
import { SkillService } from './services/skill.service';
import { CreateSkillGuard } from './guards/create-skill.guard';

@NgModule({
  imports: [
    SkillRoutingModule,
    SharedModule,
    NgbModule
  ],
  declarations: [
    SkillComponent,
    SkillCreateComponent,
    SkillUpdateComponent,
    SkillListComponent,
  ],
  providers: [
    SkillService,
    ViewSkillListGuard,
    CreateSkillGuard,
    EditSkillGuard
  ],
  exports: [
    SkillCreateComponent
  ]

})
export class SkillModule { }
