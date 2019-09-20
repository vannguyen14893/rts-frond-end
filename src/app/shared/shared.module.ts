import { GetUserByIdPipe } from './pipes/get-user-by-id.pipe';
import { CandidateStatusFigureComponent } from './components/candidate-status-figure/candidate-status-figure.component';
import { CandidateListCardComponent } from './components/candidate-list-card/candidate-list-card.component';
import { CandidateHeaderComponent } from './components/candidate-header/candidate-header.component';
import { CvSearchBoxDirective } from './directives/cv-search-box.directive';
import { NameDirective } from './directives/name.directive';
import { JobTitleDirective } from './directives/job-title.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HrefPreventDefaultDirective } from './directives/href-prevent-default.directive';
import { UnwrapTagDirective } from './directives/unwrap-tag.directive';
import { SummaryPipe } from './pipes/summary.pipe';
import { SortableColumnComponent } from './components/sortable-column/sortable-column.component';
import { PhoneNumberDirective } from './directives/phone.directive';
import { OnlyNumberDirective } from './directives/only-number.directive';
import { LetterNumberOnlyDirective } from './directives/letter-number-only.directive';
import { UsernameDirective } from './directives/username.directive';
import { EmailDirective } from './directives/email.directive';
import { RolePipe } from './pipes/role.pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { NoSpecialKeyDirective } from './directives/no-special-key.directive';
import { ResourcePublicPipe } from './pipes/resource-public.pipe';
import { ModalMessageComponent } from './components/modal-message/modal-message.component';
import { ResourceStaticPipe } from './pipes/resource-static.pipe';
import { UserSearchBoxDirective } from './directives/user-search-box.directive';
import { StatusReportComponent } from './components/status-report/status-report.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommentComponent } from './components/comment/comment.component';
import { LogComponent } from './components/log/log.component';
import { InterviewItemComponent } from './components/interview-item/interview-item.component';
import { GetCandidatesByAssigneePipe } from './pipes/get-candidates-by-assignee.pipe';
import { LengthPipe } from './pipes/length.pipe';
import { GetCommentsFromCandidatePipe } from './pipes/get-comments-from-candidate.pipe';
import { GetRequestAssigneesFromRequestPipe } from './pipes/get-request-assignees-from-request.pipe';
import { GetCandidatesByStatusPipe } from './pipes/get-candidates-by-status.pipe';
import { ElapsedTimePipe } from './pipes/elapsed-time.pipe';
import { TabComponent } from './components/tab/tab.component';
import { FilterStatusPipe } from './pipes/filter-status.pipe';
import { UserCardComponent } from './components/user-card/user-card.component';
import { RoundPipe } from './pipes/round.pipe';
import { ModalComponent } from './components/modal/modal.component';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { CustomDatePipe } from './pipes/custom-date.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
    SweetAlert2Module
  ],
  exports: [
    NgbModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SweetAlert2Module,
    HrefPreventDefaultDirective,
    UnwrapTagDirective,
    SummaryPipe,
    SortableColumnComponent,
    JobTitleDirective,
    NameDirective,
    PhoneNumberDirective,
    OnlyNumberDirective,
    LetterNumberOnlyDirective,
    UsernameDirective,
    EmailDirective,
    RolePipe,
    NgSelectModule,
    NoSpecialKeyDirective,
    CvSearchBoxDirective,
    ResourcePublicPipe,
    ResourceStaticPipe,
    ModalMessageComponent,
    UserSearchBoxDirective,
    StatusReportComponent,
    AvatarComponent,
    CandidateListCardComponent,
    CandidateHeaderComponent,
    CandidateStatusFigureComponent,
    CommentComponent,
    LogComponent,
    InterviewItemComponent,
    GetCandidatesByAssigneePipe,
    LengthPipe,
    GetCommentsFromCandidatePipe,
    GetRequestAssigneesFromRequestPipe,
    GetUserByIdPipe,
    GetCandidatesByStatusPipe,
    ElapsedTimePipe,
    TabComponent,
    FilterStatusPipe,
    UserCardComponent,
    RoundPipe,
    ModalComponent,
    CustomDatePipe
  ],
  declarations: [
    HrefPreventDefaultDirective,
    UnwrapTagDirective,
    SummaryPipe,
    SortableColumnComponent,
    JobTitleDirective,
    NameDirective,
    PhoneNumberDirective,
    OnlyNumberDirective,
    LetterNumberOnlyDirective,
    UsernameDirective,
    EmailDirective,
    RolePipe,
    NoSpecialKeyDirective,
    CvSearchBoxDirective,
    ResourcePublicPipe,
    ModalMessageComponent,
    ResourceStaticPipe,
    UserSearchBoxDirective,
    StatusReportComponent,
    AvatarComponent,
    CandidateListCardComponent,
    CandidateHeaderComponent,
    CandidateStatusFigureComponent,
    CommentComponent,
    LogComponent,
    InterviewItemComponent,
    GetCandidatesByAssigneePipe,
    LengthPipe,
    GetCommentsFromCandidatePipe,
    GetRequestAssigneesFromRequestPipe,
    GetUserByIdPipe,
    GetCandidatesByStatusPipe,
    ElapsedTimePipe,
    TabComponent,
    FilterStatusPipe,
    UserCardComponent,
    RoundPipe,
    ModalComponent,
    CustomDatePipe,
  ],
  providers: [
  ]
})
export class SharedModule {
}
