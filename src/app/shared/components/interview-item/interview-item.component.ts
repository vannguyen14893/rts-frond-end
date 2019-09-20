import { IdentityService } from './../../../core/services/identity.service';
import { Candidate } from './../../../model/candidate.class';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Interview } from '../../../model/interview.class';
import { User } from '../../../model/user.class';
import { Cv } from '../../../model/cv.class';
import { select } from 'ng2-redux';
import { IRootState } from '../../../core/redux/root.store';
import { NavigationService } from '../../../core/services/navigation.service';
import { RequestCenterService } from '../../../request-management/services/request-center.service';

@Component({
  selector: 'app-interview-item',
  templateUrl: './interview-item.component.html',
  styleUrls: ['./interview-item.component.css']
})
export class InterviewItemComponent implements OnInit {

  @Input() interview: Interview;

  @Output() addInterviewer$ = new EventEmitter<void>();
  @Output() addCandidate$ = new EventEmitter<void>();
  @Output() sendMeetingRequest$ = new EventEmitter<void>();
  @Output() goComment = new EventEmitter<void>();
  @select((s: IRootState) => s.uiStore.requestCenterUiStore.currentModal) currentModal$;
  @select((s: IRootState) => s.uiStore.requestCenterUiStore.currentInterviewTab) currentInterviewTab$;

  // Permission
  canEditInterview = false;

  constructor(
    identityService: IdentityService,
    private navigationService : NavigationService,
  ) {
    this.canEditInterview = identityService.getCurrentUser().permission.editInterview;
  }

  ngOnInit() {
  }
  addInterviewer () {
    this.addInterviewer$.emit();
  }
  addCandidate() {
    this.addCandidate$.emit();
  }
  navigateToInterviewDetail(id) {
    this.navigationService.navInterviewDetail(id);
  }
   navigateToComment(id) {
    this.navigationService.navInterviewToComment(id);
  }
  sendMeetingRequest(){
    this.sendMeetingRequest$.emit();
  }
}
