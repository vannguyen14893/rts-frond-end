import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select, NgRedux } from 'ng2-redux';
import { IRootState } from '../../../../core/redux/root.store';
import { Interview } from '../../../../model/interview.class';
import { User } from '../../../../model/user.class';
import { denormalizeInterview, denormalizeUserArray } from '../../../../core/redux/domain/domain.normalization';
import { FormGroup, FormControl, Validators, FormBuilder, FormGroupName } from '@angular/forms';
import { CommonValidator } from '../../../../shared/custom-validator/common.validator';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { InterviewService } from '../../../../interview/services/interview.service';
import { NavigationService } from '../../../../core/services/navigation.service';
import { Status } from '../../../../model/status.class';
import { Candidate } from '../../../../model/candidate.class';
import { RequestCenterService } from '../../../services/request-center.service';
import { Helpers } from '../../../../helpers';

@Component({
  selector: 'app-send-meeting-request',
  templateUrl: './send-meeting-request.component.html',
  styleUrls: ['./send-meeting-request.component.css'],
  providers: [InterviewService],
})
export class SendMeetingRequestComponent implements OnInit {
  @select((s: IRootState) => s.appStore.requestCenterStore.currentInterviewId) currentInterviewId$;
  @select((s: IRootState) => s.domainStore.interviews) interviews$;
  @select((s: IRootState) => s.domainStore.userIds) userIds$;

  currentInterview: Interview;
  allUsers: User[];
  sourceInterviewers: User[];
  searchResults: User[] = [];

  meetingRequest: FormGroup;
  isSubmitting = false;

  //start time
  oldDate: Date;
  startDateError = false;
  //end time
  endDateError = false;
  ngbStartTimeError = false;
  ngbEndTimeError = false;

  error = {
    isError: false,
    message: ''
  };

  constructor(
    private ngRedux: NgRedux<IRootState>,
    private fb: FormBuilder,
    private interviewService: InterviewService,
    private requestService: RequestCenterService,
  ) { 
    this.meetingRequest = fb.group({
      title: ['', [Validators.required, Validators.maxLength(255), CommonValidator.notEmpty]],
      location: ['', [Validators.required, Validators.maxLength(255), CommonValidator.notEmpty]],
      startTime: [{}, Validators.required],
      ngbTimeStart: [{}, Validators.required],
      endTime: [{}, Validators.required],
      ngbTimeEnd: [{}, Validators.required],
      note: ['', [Validators.maxLength(255)]],
      statusId: [{}, [Validators.required]],
      userCollection: [[{}], [Validators.required]],
      candidateCollection: [[{}], [Validators.required]]
    });
  }

  ngOnInit() {
  // Lấy interview hiện tại
  Observable.combineLatest(
    this.interviews$,
    this.currentInterviewId$,
    this.userIds$
  ).subscribe(res => {
    if (res[1] !== 0) {
      this.currentInterview = denormalizeInterview(res[0][res[1]], this.ngRedux.getState()['domainStore']);
    }
    if (res[2].length > 0) {
      this.allUsers = denormalizeUserArray(res[2], this.ngRedux.getState()['domainStore']);
      this.sourceInterviewers = this.allUsers.filter(u => this.currentInterview.userCollection.findIndex(u2 => u2.id === u.id) < 0);
      this.searchResults = this.sourceInterviewers;
    }
  });

  this.meetingRequest = new FormGroup({
    title: new FormControl(),
    location: new FormControl(),
    startTime: new FormControl(),
    ngbTimeStart: new FormControl(),
    endTime: new FormControl(),
    ngbTimeEnd: new FormControl(),
    statusId: new FormControl(),
    note: new FormControl(),
    userCollection: new FormControl(),
  });
    
 
  const startDate = new Date(this.currentInterview.startTime);
  this.oldDate = new Date(this.currentInterview.endTime);
  this.meetingRequest.patchValue({
        title: this.currentInterview.title,
        location: this.currentInterview.location,
        startTime: { year: startDate.getFullYear(), month: startDate.getMonth(), day: startDate.getDate()},
        ngbTimeStart: {hour: startDate.getHours(), minute: startDate.getMinutes()},
        endTime:{year: this.oldDate.getFullYear(), month: this.oldDate.getMonth(), day: this.oldDate.getDate()},
        ngbTimeEnd: { hour: this.oldDate.getHours(), minute: this.oldDate.getMinutes() },
        status: this.currentInterview.statusId,
        note: this.currentInterview.note,
        userCollection: this.currentInterview.userCollection,
      })
  }

  onSubmit() {
    const startDate = new Date(
      this.startTime.value.year,
      this.startTime.value.month - 1,
      this.startTime.value.day,
      this.ngbTimeStart.value.hour,
      this.ngbTimeStart.value.minute);
    const endDate = new Date(
      this.endTime.value.year,
      this.endTime.value.month - 1,
      this.endTime.value.day,
      this.ngbTimeEnd.value.hour,
      this.ngbTimeEnd.value.minute);

      Helpers.setLoading(true);
      this.isSubmitting = true;
      this.ngbStartTimeError = false;
      this.ngbEndTimeError = false;
      this.error.isError = false;
      this.error.message = '';

      const interview = {
        id: this.currentInterview.id,
        title: this.title.value.trim(),
        startTime: startDate,
        endTime: endDate,
        location: this.location.value.trim(),
        userCollection: this.currentInterview.userCollection.values,
      };
      this.requestService.sendMeetingRequest(interview)
        .subscribe(response => {
          Helpers.setLoading(false);
          this.isSubmitting = false;
          this.error.isError = false;
          this.requestService.closeModal();
        }, error => {
          Helpers.setLoading(false);
          this.isSubmitting = false;
          this.error.isError = true;
          if (error.status === 400) {
            this.error.message = "Conflict interview time of these users: " + error.error + ", please choose again with valid time";
          } else {
            this.error.message = error.error;
          }
          window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
        });
    
    // console.log('sssssssssssss');
    // this.interviewService.sendMeetingRequest(this.currentInterview);
     console.log(this.meetingRequest);
  }
 
  onSelectStartTime(event, d1) {
    // console.log(event, ".>>>>>.....");
    const startDate = new Date(event.year, event.month - 1, event.day);
    const endDate = new Date(this.oldDate.getFullYear(), this.oldDate.getMonth() - 1, this.oldDate.getDate());
    const currentDate = new Date();
    if (startDate < endDate || startDate < currentDate) {
      this.startDateError = true;
    } else {
      this.startDateError = false;
    }
  }

  onSelectEndTime(event, d2) {
    const startDate1 = new Date(this.currentInterview.startTime);
    const endDate = new Date(event.year, event.month - 1, event.day);
    const startDate = new Date(startDate1.getFullYear(), startDate1.getMonth() - 1, startDate1.getDate());
    if (startDate > endDate) {
      this.endDateError = true;
    } else {
      this.endDateError = false;
    }
  }

  validateDate(startDate: Date, endDate: Date): boolean {
    if (startDate < this.oldDate && startDate < endDate) {
      this.ngbStartTimeError = true;
      this.ngbEndTimeError = false;
      return true;
    } else if (startDate > this.oldDate && startDate > endDate) {
      this.ngbStartTimeError = false;
      this.ngbEndTimeError = true;
      return true;
    } else if (startDate < this.oldDate && startDate > endDate) {
      this.ngbStartTimeError = true;
      this.ngbEndTimeError = true;
      return true;
    } else { return false; }
  }

  get title() {
    return this.meetingRequest.get('title');
  }

  get location() {
    return this.meetingRequest.get('location');
  }

  get startTime() {
    return this.meetingRequest.get('startTime');
  }

  get ngbTimeStart() {
    return this.meetingRequest.get('ngbTimeStart');
  }

  get endTime() {
    return this.meetingRequest.get('endTime');
  }

  get ngbTimeEnd() {
    return this.meetingRequest.get('ngbTimeEnd');
  }

  get note() {
    return this.meetingRequest.get('note');
  }

  get statusId() {
    return this.meetingRequest.get('statusId');
  }

  // get userCollection() {
  //   return this.meetingRequest.get('userCollection');
  // }

  // get candidateCollection() {
  //   return this.meetingRequest.get('candidateCollection');
  // }


 
}
