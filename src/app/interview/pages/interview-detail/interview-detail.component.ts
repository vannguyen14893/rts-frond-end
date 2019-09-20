import { CommonValidator } from './../../../shared/custom-validator/common.validator';
import { Status } from './../../../model/status.class';
import { HttpClient } from '@angular/common/http';
import { Interview } from './../../../model/interview.class';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InterviewService } from './../../services/interview.service';
import { NavigationService } from './../../../core/services/navigation.service';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/switchMap';
import { ActivatedRoute } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Candidate } from '../../../model/candidate.class';
import { User } from '../../../model/user.class';
import { API_URL } from '../../../shared/constants/api.constant';
import { environment } from '../../../../environments/environment';
import { InterviewValidator } from '../../../shared/custom-validator/interview.validator';
import { Helpers } from '../../../helpers';
import { sampleTime } from 'rxjs/operator/sampleTime';
import { ActionCreatorService } from '../../../core/services/action-creator.service';
import { NgRedux, select } from 'ng2-redux';
import { IRootState } from '../../../core/redux/root.store';
import { RequestCenterService } from '../../../request-management/services/request-center.service';
import { normalizeCandidate, denormalizeCandidate } from '../../../core/redux/domain/domain.normalization';
import { CANDIDATE_UPDATE } from '../../../core/redux/domain/domain.action';
import { IdentityService } from '../../../core/services/identity.service';

@Component({
  selector: 'app-interview-detail.m-grid__item.m-grid__item--fluid.m-wrapper',
  templateUrl: './interview-detail.component.html',
  styleUrls: ['./interview-detail.component.css']
})
export class InterviewDetailComponent implements OnInit, OnDestroy {
  @select((s: IRootState) => s.appStore.requestCenterStore.currentCandidateId) currentCandidateId$;
  @select((s: IRootState) => s.domainStore.candidates) candidates$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentRequestCandidateIds) candidateIds$;
  
  globalBodyClass = 'm-page--loading-non-block m-page--fluid m--skin- m-content--skin-light2 m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default';

  id;
  oldDate: Date;
  formInterview: FormGroup;
  interview: Interview;
  listStatus: Status[];
  listCandidateByRequestId: Candidate[];
  listUser: User[];
  listDepartment;
  startDateError = false;
  endDateError = false;
  ngbStartTimeError = false;
  ngbEndTimeError = false;
  isSubmitting = false;

  subInterview: Subscription;
  subListUser: Subscription;
  subListStatus: Subscription;
  subListCandidateByRequestId: Subscription;
  subListDepartment: Subscription;

  //comment
  comment = '';
  currentCandidateId: number;
  currentCandidate: Candidate; // To get comment List and show info card
  @ViewChild('inputComment') inputComment: ElementRef;
  currentUser: User;
  activeComment: string;

  error = {
    isError: false,
    message: ''
  };

  constructor(
    private navigationService: NavigationService,
    private interviewService: InterviewService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private actionCreatorService: ActionCreatorService,
    private ngRedux: NgRedux<IRootState>,
    private requestService: RequestCenterService,
    private identityService: IdentityService,
  ) {
    this.formInterview = fb.group({
      title: ['', [Validators.required, Validators.maxLength(255), CommonValidator.notEmpty]],
      location: ['', [Validators.required, Validators.maxLength(255), CommonValidator.notEmpty]],
      startTime: [{}, Validators.required],
      ngbTimeStart: [{}, Validators.required],
      endTime: [{}, Validators.required],
      ngbTimeEnd: [{}, Validators.required],
      note: ['', [Validators.maxLength(255)]],
      statusId: [{}, [Validators.required]],
      userCollection: [[{}]],
      candidateCollection: [[{}]]
    });
    this.currentUser = identityService.getCurrentUser();

    // this.formInterview.disable() 
  }

  ngOnInit() {
    // this.listStatus = [];
    this.subInterview = Observable.combineLatest([
      this.route.paramMap
    ]).switchMap(combined => {
      this.id = combined[0].get('id');
      this.activeComment = combined[0].get('comment');
      if(this.activeComment == null){
        this.activeComment = 'false';
      }
      if (isNaN(this.id)) {
        this.navigationService.navErrorNotFound();
      }

      this.subListStatus = this.interviewService.getAllStatus()
        .subscribe(response => {
          this.listStatus = response
        }
        )

      return this.interviewService.getOneInterview(this.id);
    }).subscribe((response: Interview) => {
      this.interview = response;
      const startDate = new Date(this.interview.startTime);
      this.oldDate = new Date(this.interview.endTime);
      // Set infomation for view detail

      this.startTime.setValue({ year: startDate.getFullYear(), month: startDate.getMonth()+1, day: startDate.getDate() });
      this.ngbTimeStart.setValue({ hour: startDate.getHours(), minute: startDate.getMinutes() });
      this.endTime.setValue({ year: this.oldDate.getFullYear(), month: this.oldDate.getMonth()+1, day: this.oldDate.getDate() });
      this.ngbTimeEnd.setValue({ hour: this.oldDate.getHours(), minute: this.oldDate.getMinutes() });

      this.title.setValue(this.interview.title);
      this.location.setValue(this.interview.location);
      this.note.setValue(this.interview.note);
      this.statusId.setValue(this.interview.statusId);
      this.userCollection.setValue(this.interview.userCollection);
      this.candidateCollection.setValue(this.interview.candidateCollection);

      this.getAllCandidatesByRequestId();
      // this.getAllUsers(1);
      this.subListDepartment = this.interviewService.getAllDepartment()
        .subscribe(res => {
          this.listDepartment = res;
          this.error.isError = false;
        }, (error) => {
          this.error.isError = true;
          this.error.message = error.error;
        });
    });
    /**
     * Nếu selectedCandidate có sự thay đổi, thực hiện các action sau:
     * 1. Get log của candidate
     * 2. Get các interview của candidate
     */
    this.currentCandidateId$.subscribe(id => {
      this.currentCandidateId = id;
      if (id !== 0) {
        // Lấy log list
        this.actionCreatorService.fetchCurrentCandidateLogs();
        // Lấy interview list và chọn 1 interview đầu làm default
        this.actionCreatorService.fetchCandidateInterviewsAndSelectDefault();
      }
    });
     /**
     * Lấy toàn bộ user về, lưu trong store
     * để phục vụ make interview, add interviewers
     */
    this.actionCreatorService.fetchAllUser();
    // Denormalize candidate để lấy full dữ liệu
    Observable.combineLatest(
      this.candidates$,
      this.currentCandidateId$,
      this.candidateIds$
    ).subscribe(res => {
      if (res[0] && res[1] !== 0) {
        this.currentCandidate = denormalizeCandidate(res[0][res[1]], this.ngRedux.getState()['domainStore']);
      }
    });

  }

  onSelectStartTime(event, d1) {
    const startDate = new Date(event.year, event.month - 1, event.day);
    const endDate = new Date(this.oldDate.getFullYear(), this.oldDate.getMonth() - 1, this.oldDate.getDate());
    const currentDate = new Date();
    if (startDate < endDate /*|| startDate < currentDate*/) {
      this.startDateError = true;
    }
     else {
      this.startDateError = false;
    }
  }

  onSelectEndTime(event, d2) {
    const endDate = new Date(event.year, event.month - 1, event.day);
    const startDate = new Date(this.startTime.value.year, this.startTime.value.month - 1, this.startTime.value.day)
    if (startDate > endDate) {
      this.endDateError = true;
    }
     else {
      this.endDateError = false;
    }
  }

  // đoạn code này dùng cho việc lấy tất cả các user từ phòng ban để assign phỏng vấn.
  changeUser(event) {
    // this.getAllUsers(event.target.value);
  }

  // getAllUsers(id) {
  //   this.subListUser = this.interviewService.getAllUser({ id: id })
  //     .subscribe(response => {
  //       this.listUser = response;
  //       if (this.listUser.length > 0) {
  //         this.listUser = this.substractUser(this.listUser, this.interview.userCollection);
  //       }
  //     });
  // }

  getAllCandidatesByRequestId() {
    this.subListCandidateByRequestId = this.interviewService.getCandidatesByRequestId(
      this.interview.candidateCollection[0].requestId.id
    )
      .subscribe(response => {
        this.listCandidateByRequestId = response;
        if (this.listCandidateByRequestId.length > 0) {
          this.listCandidateByRequestId = this.substractCandidate(this.listCandidateByRequestId, this.interview.candidateCollection);
        }
      });
  }

  substractCandidate(a1: Candidate[], a2: Candidate[]): any {
    for (let i = 0; i < a1.length; i++) {
      for (let j = 0; j < a2.length; j++) {
        if (a1[i].id === a2[j].id) {
          a1.splice(i, 1);
        }
      }
    }
    return a1;
  }

  substractUser(a1: User[], a2: User[]): any {
    for (let i = 0; i < a2.length; i++) {
      const index = a1.findIndex(item => item.id === a2[i].id);
      a1.splice(index, 1);
    }
    return a1;
  }

  backToList() {
    this.navigationService.navInterviewList();
  }

  onAddCandidate(id) {
    const candidate = this.listCandidateByRequestId.filter(item => item.id === id)[0];
    this.interview.candidateCollection.push(candidate);
    this.listCandidateByRequestId.splice(this.listCandidateByRequestId.findIndex(item => item.id === id), 1);
    this.candidateCollection.setValue(this.interview.candidateCollection);
  }

  onAddUser(id) {
    const user = this.listUser.filter(item => item.id === id)[0];
    this.listUser.splice(this.listUser.findIndex(item => item.id === id), 1);
    this.interview.userCollection.push(user);
    this.userCollection.setValue(this.interview.userCollection);
  }

  onDeleteCandidate(id) {
    const candidate = this.interview.candidateCollection.filter(item => item.id === id)[0];
    this.listCandidateByRequestId.push(candidate);
    this.interview.candidateCollection.splice(this.interview.candidateCollection.findIndex(item => item.id === id), 1);
    this.candidateCollection.setValue(this.interview.candidateCollection);
  }

  onDeleteUser(id) {
    const user = this.interview.userCollection.filter(item => item.id === id)[0];
    this.interview.userCollection.splice(this.interview.userCollection.findIndex(item => item.id === id), 1);
    this.listUser.push(user);
    this.userCollection.setValue(this.interview.userCollection);
  }

  updateInterview() {
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
    if (this.validateDate(startDate, endDate)) {
      this.error.isError = true;
      this.error.message = 'Start time must equal or greater than old time and End Time must greater than Start time.';
    }
      else if (this.candidateCollection.invalid) {
      this.ngbStartTimeError = false;
      this.ngbEndTimeError = false;
      this.error.isError = true;
      this.error.message = 'Candidates field has not been choosing candidates.';
    } else if (this.userCollection.invalid) {
      this.ngbStartTimeError = false;
      this.ngbEndTimeError = false;
      this.error.isError = true;
      this.error.message = 'Interviewers* field has not been choosing interviewers.';
    } else if (this.formInterview.valid
      // && this.userCollection.value.length > 0
      // && this.candidateCollection.value.length > 0
      // && !this.validateDate(startDate, endDate)
    ) {
      Helpers.setLoading(true);
      this.isSubmitting = true;
      this.ngbStartTimeError = false;
      this.ngbEndTimeError = false;
      this.error.isError = false;
      this.error.message = '';
      let inputNote;
      if (this.note.value)
        inputNote = this.note.value.trim();

      const interview = {
        id: this.interview.id,
        title: this.title.value.trim(),
        startTime: startDate,
        endTime: endDate,
        location: this.location.value.trim(),
        note: inputNote,
        userCollection: this.userCollection.value,
        candidateCollection: this.candidateCollection.value,
        statusId: this.statusId.value
      };
      this.interviewService.interviewUpdate(interview)
        .subscribe(response => {
          Helpers.setLoading(false);
          this.isSubmitting = false;
          this.error.isError = false;
          this.navigationService.navInterviewList();
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
    } else {
      this.ngbStartTimeError = false;
      this.ngbEndTimeError = false;
      this.error.isError = true;
      this.error.message = 'Please make sure you have filled in all the required fields.';
    }
  }

  validateDate(startDate: Date, endDate: Date): boolean {
    if (startDate > endDate) {
      this.ngbStartTimeError = true;
      this.ngbEndTimeError = true;
      return true;
    }
    this.ngbStartTimeError = false;
    this.ngbEndTimeError = false;
    return false;

    // if (startDate < this.oldDate && startDate < endDate) {
    //   this.ngbStartTimeError = true;
    //   this.ngbEndTimeError = false;
    //   return true;
    // } else if (startDate > this.oldDate && startDate > endDate) {
    //   this.ngbStartTimeError = false;
    //   this.ngbEndTimeError = true;
    //   return true;
    // } else if (startDate < this.oldDate && startDate > endDate) {
    //   this.ngbStartTimeError = true;
    //   this.ngbEndTimeError = true;
    //   return true;
    // } else { return false; }
  }

  get title() {
    return this.formInterview.get('title');
  }

  get location() {
    return this.formInterview.get('location');
  }

  get startTime() {
    return this.formInterview.get('startTime');
  }

  get ngbTimeStart() {
    return this.formInterview.get('ngbTimeStart');
  }

  get endTime() {
    return this.formInterview.get('endTime');
  }

  get ngbTimeEnd() {
    return this.formInterview.get('ngbTimeEnd');
  }

  get note() {
    return this.formInterview.get('note');
  }

  get statusId() {
    return this.formInterview.get('statusId');
  }

  get userCollection() {
    return this.formInterview.get('userCollection');
  }

  get candidateCollection() {
    return this.formInterview.get('candidateCollection');
  }

  ngOnDestroy(): void {
    if (this.subInterview) {
      this.subInterview.unsubscribe();
    }
    if (this.subListUser) {
      this.subListUser.unsubscribe();
    }
    if (this.subListStatus) {
      this.subListStatus.unsubscribe();
    }
    if (this.subListCandidateByRequestId) {
      this.subListCandidateByRequestId.unsubscribe();
    }
    if (this.subListDepartment) {
      this.subListDepartment.unsubscribe();
    }
  }

  sendComment() {
    if (this.comment && this.comment.length > 0 && this.currentCandidateId && this.currentCandidateId !== 0) {
      this.requestService
        .sendCommentInterview(this.comment, this.currentUser.id, this.currentCandidateId, this.interview.id)
        .subscribe(res => {
          // Update store
          this.currentCandidate.commentCollection.push(res);
        this.ngRedux.dispatch({
          type: CANDIDATE_UPDATE,
          payload: normalizeCandidate(this.currentCandidate)
        });
        this.actionCreatorService.fetchCurrentCandidateLogs();
        this.comment = '';
      }, err => console.error(err));
    }
  }
}
