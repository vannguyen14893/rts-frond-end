import { RequestManagementService } from './../request-management/services/request-management.service';
import { ViewInterviewDetailGuard } from './guards/view-interview-detail.guard';
import { CreateInterviewGuard } from './guards/create-interview.guard';
import { ViewInterviewListGuard } from './guards/view-interview-list.guard';
import { InterviewService } from './services/interview.service';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { InterviewRoutingModule } from './interview-routing.module';
import { InterviewComponent } from './interview.component';
import { InterviewListComponent } from './pages/interview-list/interview-list.component';
import { InterviewDetailComponent } from './pages/interview-detail/interview-detail.component';
import { InterviewCreateComponent } from './pages/interview-create/interview-create.component';
import { InterviewListDuComponent } from './components/interview-list-du/interview-list-du.component';
import { EditInterviewGuard } from './guards/edit-interview.guard';
import { CvService } from '../cv/service/cv.service';
import { CandidateListComponent } from './components/candidate-list/candidate-list.component';
import { RequestCenterService } from '../request-management/services/request-center.service';
import { CommentListComponent } from './components/comment-list/comment-list.component';

@NgModule({
  imports: [
    InterviewRoutingModule,
    SharedModule,
    NgbModule,
  ],
  declarations: [
    InterviewComponent,
    InterviewListComponent,
    InterviewDetailComponent,
    InterviewCreateComponent,
    InterviewListDuComponent,
    CandidateListComponent,
    CommentListComponent
  ],
  exports: [
    InterviewListDuComponent
  ],
  providers: [
    InterviewService,
    RequestManagementService,
    ViewInterviewListGuard,
    CreateInterviewGuard,
    EditInterviewGuard,
    ViewInterviewDetailGuard,
    CvService,
    RequestCenterService,
  ]
})
export class InterviewModule { }
