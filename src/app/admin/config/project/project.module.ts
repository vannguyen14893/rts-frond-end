import { ViewProjectListGuard } from './guards/view-project-list.guard';
import { ProjectRoutingModule } from './project.routing';
import { ProjectService } from './service/project.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { ProjectListComponent } from './page/project-list/project-list.component';
import { ProjectCreateComponent } from './page/project-create/project-create.component';
import { ProjectUpdateComponent } from './page/project-update/project-update.component';
import { ProjectComponent } from './project.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    NgbModule,
    ProjectRoutingModule
  ],
  declarations: [
    ProjectComponent,
    ProjectListComponent,
    ProjectCreateComponent,
    ProjectUpdateComponent],
  providers: [
    ProjectService,
    ViewProjectListGuard
  ],
  exports: [
    ProjectCreateComponent
  ]

})
export class ProjectModule { }
