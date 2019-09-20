import { ViewRequestCenterGuard } from './guards/view-request-center.guard';
import { NgModule } from '@angular/core';
import { DepartmentModule } from '../admin/config/department/department.module';
import { PriorityModule } from '../admin/config/priority/priority.module';
import { RequestStatusModule } from '../admin/config/request-status/request-status.module';
import { UserModule } from '../admin/user/user.module';
import { GetAllService } from '../core/services/get-all.service';
import { SharedModule } from '../shared/shared.module';
import { CvModule } from './../cv/cv.module';
import { CandidateActionBarComponent } from './components/candidate-action-bar/candidate-action-bar.component';
import { CandidateFiguresComponent } from './components/candidate-figures/candidate-figures.component';
import { CandidateInfoComponent } from './components/candidate-info/candidate-info.component';
import { CandidateListComponent } from './components/candidate-list/candidate-list.component';
import { CandidateLogListComponent } from './components/candidate-log-list/candidate-log-list.component';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { InterviewListComponent } from './components/interview-list/interview-list.component';
import {
  RequestManagementDetailDuLeadComponent
} from './components/request-management-detail-du-lead/request-management-detail-du-lead.component';
import {
  RequestManagementDetailDuMemberComponent
} from './components/request-management-detail-du-member/request-management-detail-du-member.component';
import {
  RequestManagementDetailHrMemberComponent
} from './components/request-management-detail-hr-member/request-management-detail-hr-member.component';
import {
  RequestManagementDetailGroupLeadComponent
} from './components/request-management-detail-group-lead/request-management-detail-group-lead.component';
import { ViewRequestDetailGuard } from './guards/view-request-detail.guard';
import { ViewRequestListGuard } from './guards/view-request-list.guard';
import { HomeComponent } from './pages/home/home.component';
import { RequestListComponent } from './pages/home/request-list/request-list.component';
import { AddCandidateToInterviewComponent } from './pages/modals/add-candidate-to-interview/add-candidate-to-interview.component';
import { AddCandidateToRequestComponent } from './pages/modals/add-candidate-to-request/add-candidate-to-request.component';
import { AddInterviewerComponent } from './pages/modals/add-interviewer/add-interviewer.component';
import { ChangeCandidateStatusComponent } from './pages/modals/change-candidate-status/change-candidate-status.component';
import { EditCandidateComponent } from './pages/modals/edit-candidate/edit-candidate.component';
import { MakeInterviewComponent } from './pages/modals/make-interview/make-interview.component';
import { RejectCandidateComponent } from './pages/modals/reject-candidate/reject-candidate.component';
import { RejectRequestComponent } from './pages/modals/reject-request/reject-request.component';
import { SubmitRequestComponent } from './pages/modals/submit-request/submit-request.component';
import { ViewRequestDetailComponent } from './pages/modals/view-request-detail/view-request-detail.component';
import { RequestCenterComponent } from './pages/request-center/request-center.component';
import { RequestManagementCreateComponent } from './pages/request-management-create/request-management-create.component';
import { RequestManagementDetailComponent } from './pages/request-management-detail/request-management-detail.component';
import { RequestManagementRoutingModule } from './request-management-routing.module';
import { RequestManagementComponent } from './request-management.component';
import { ActionCreatorService } from '../core/services/action-creator.service';
import { RequestCenterService } from './services/request-center.service';
import { RequestManagementService } from './services/request-management.service';
import { StoredProcedureService } from './services/stored-procedure.service';
import { CreateRequestGuard } from './guards/create-request.guard';
import { CreateRequestDeactiveGuard } from './guards/create-request.deactive.guard';
import { CloseRequestComponent } from './pages/modals/close-request/close-request.component';
import { AttachmentItemComponent } from './components/attachment-item/attachment-item.component';
import { SendMeetingRequestComponent } from './pages/modals/send-meeting-request/send-meeting-request.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RequestLogListComponent } from './components/request-log-list/request-log-list.component';

@NgModule({
  imports: [
    SharedModule,
    RequestManagementRoutingModule,
    CvModule,
    RequestStatusModule,
    PriorityModule,
    DepartmentModule,
    UserModule,
    ReactiveFormsModule,
  ],
  declarations: [
    RequestCenterComponent,
    RequestManagementComponent,
    CandidateFiguresComponent,
    CandidateInfoComponent,
    CandidateListComponent,
    InterviewListComponent,
    CandidateLogListComponent,
    CommentListComponent,
    RequestManagementDetailComponent,
    RequestManagementCreateComponent,
    RequestManagementDetailDuLeadComponent,
    RequestManagementDetailDuMemberComponent,
    RequestManagementDetailHrMemberComponent,
    RequestManagementDetailGroupLeadComponent,
    AddInterviewerComponent,
    CandidateActionBarComponent,
    MakeInterviewComponent,
    EditCandidateComponent,
    RejectCandidateComponent,
    ChangeCandidateStatusComponent,
    AddCandidateToInterviewComponent,
    AddCandidateToRequestComponent,
    ViewRequestDetailComponent,
    HomeComponent,
    RequestListComponent,
    RejectRequestComponent,
    SubmitRequestComponent,
    CloseRequestComponent,
    AttachmentItemComponent,
    SendMeetingRequestComponent,
    RequestLogListComponent,
  ],
  exports: [
    ViewRequestDetailComponent
  ],
  providers: [
    RequestCenterService,
    RequestManagementService,
    GetAllService,
    ActionCreatorService,
    StoredProcedureService,
    ViewRequestListGuard,
    ViewRequestDetailGuard,
    ViewRequestCenterGuard,
    CreateRequestGuard,
    CreateRequestDeactiveGuard,
  ],
})
export class RequestManagementModule { }
