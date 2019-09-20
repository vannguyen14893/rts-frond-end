import { ViewExperienceListGuard } from './guards/view-experience-list.guard';
import { ExperienceComponent } from './experience.component';
import { NgModule } from '@angular/core';
import { ExperienceCreateComponent } from './page/experience-create/experience-create.component';
import { ExperienceUpdateComponent } from './page/experience-update/experience-update.component';
import { ExperienceListComponent } from './page/experience-list/experience-list.component';
import { ExperienceService } from './service/experience.service';
import { SharedModule } from '../../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExperienceRoutingModule } from './experience.routing';

@NgModule({
  imports: [
    SharedModule,
    NgbModule,
    ExperienceRoutingModule,
  ],
  declarations: [
    ExperienceComponent,
    ExperienceCreateComponent,
    ExperienceUpdateComponent,
    ExperienceListComponent
  ],
  providers: [
    ExperienceService,
    ViewExperienceListGuard
  ],
  exports: [
    ExperienceCreateComponent
  ]

})
export class ExperienceModule { }
