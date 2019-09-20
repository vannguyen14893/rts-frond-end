import { Helpers } from './../../../helpers';
import { CommonValidator } from './../../../shared/custom-validator/common.validator';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Status } from '../../../model/status.class';
import { User } from '../../../model/user.class';
import { Subscription } from 'rxjs/Subscription';
import { NavigationService } from '../../../core/services/navigation.service';
import { InterviewService } from '../../services/interview.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/switchMap';
import { Candidate } from '../../../model/candidate.class';
import { InterviewValidator } from '../../../shared/custom-validator/interview.validator';
import { CONFIG } from '../../../shared/constants/configuration.constant';
import { RequestManagementService } from '../../../request-management/services/request-management.service';

@Component({
  selector: 'app-interview-create',
  templateUrl: './interview-create.component.html',
  styleUrls: ['./interview-create.component.css']
})
export class InterviewCreateComponent implements OnInit {

  candidateId;
  requestId;
  formInterview: FormGroup;
  foundCandidate: Candidate;
  listStatus: Status[];
  listCandidateByRequestId: Candidate[];
  listUser: User[];
  listDepartment;
  listRequest;
  isSubmitting = false;

  listUserCollection: User[];
  listCandidateCollection: Candidate[];

  subListUser: Subscription;
  subListStatus: Subscription;
  subListCandidateByRequestId: Subscription;
  subListDepartment: Subscription;
  subListRequest: Subscription;

  error = {
    isError: false,
    message: ''
  };
  paramsFindAll = {
    size: CONFIG.JAVA_MAX_INT,
  }

  endDateError = false;
  ngbTimeError = false;

  constructor(
    private navigationService: NavigationService,
    private interviewService: InterviewService,
    private requestService: RequestManagementService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.formInterview = fb.group({
      title: ['', [Validators.required, Validators.maxLength(255), CommonValidator.notEmpty]],
      location: ['', [Validators.required, Validators.maxLength(255), CommonValidator.notEmpty]],
      startTime: [({ year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() }), [Validators.required, InterviewValidator.minDate]],
      ngbTimeStart: [{ hour: new Date().getHours(), minute: new Date().getMinutes() }, Validators.required],
      endTime: [({ year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1 }), Validators.required],
      ngbTimeEnd: [{ hour: new Date().getHours() + 1, minute: new Date().getMinutes() }, Validators.required],
      note: ['', [Validators.maxLength(255)]],
      statusId: ['', [Validators.required]],
      userCollection: ['', [Validators.required]],
      candidateCollection: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    Observable.combineLatest([
      this.route.queryParams
    ]).switchMap(combined => {
      this.candidateId = combined[0].get('candidateId');
      if (isNaN(this.candidateId)) {
        this.navigationService.navErrorNotFound();
      }

      return this.interviewService.getOneCandidate({ id: this.candidateId })
    }).subscribe(response => {
      this.foundCandidate = response;
    }, error => { this.foundCandidate = null; });

    this.subListRequest = this.requestService.filter(this.paramsFindAll)
      .subscribe(response => this.listRequest = response.content);
    this.subListStatus = this.interviewService.getAllStatus()
      .subscribe(response => this.listStatus = response);
    this.subListDepartment = this.interviewService.getAllDepartment()
      .subscribe(response => {
        this.listDepartment = response;
        this.error.isError = false;
      }, (error) => {
        this.error.isError = true;
        this.error.message = error.error;
      });
    this.listCandidateCollection = [];
    this.listUserCollection = [];

    if (this.foundCandidate) {
      this.listCandidateCollection.push(this.foundCandidate);
      this.getAllCandidatesByRequestId(this.foundCandidate.requestId.id);
    } else {
      this.getAllCandidatesByRequestId(1);
    }
    this.getAllUsers(1);

  }

  onSubmit() {
    const startDate = new Date(this.startTime.value.year, this.startTime.value.month - 1, this.startTime.value.day, this.ngbTimeStart.value.hour, this.ngbTimeStart.value.minute);
    const endDate = new Date(this.endTime.value.year, this.endTime.value.month - 1, this.endTime.value.day, this.ngbTimeEnd.value.hour, this.ngbTimeEnd.value.minute);
    if (!this.validateDate(startDate, endDate)) {
      this.ngbTimeError = true;
      this.error.isError = true;
      this.error.message = "Start time must equal or greater than old time and End Time must greater than Start time.";
    } else if (this.candidateCollection.invalid) {
      this.ngbTimeError = false;
      this.error.isError = true;
      this.error.message = "Candidates field has not been choosing candidates.";
    } else if (this.userCollection.invalid) {
      this.ngbTimeError = false;
      this.error.isError = true;
      this.error.message = "Interviewers* field has not been choosing interviewers.";
    } else if (this.formInterview.valid && this.userCollection.value.length > 0 && this.candidateCollection.value.length > 0 && this.validateDate(startDate, endDate)) {
      Helpers.setLoading(true);
      this.isSubmitting = true;
      this.ngbTimeError = false;
      this.error.isError = false;
      this.error.message = '';
      const interview = {
        title: this.title.value.trim(),
        startTime: this.startTime.value.day + '/' + this.startTime.value.month + '/' + this.startTime.value.year
          + ' ' + this.ngbTimeStart.value.hour + ':' + this.ngbTimeStart.value.minute,
        endTime: this.endTime.value.day + '/' + this.endTime.value.month + '/' + this.endTime.value.year
          + ' ' + this.ngbTimeEnd.value.hour + ':' + this.ngbTimeEnd.value.minute,
        location: this.location.value.trim(),
        note: this.note.value.trim(),
        userCollection: this.userCollection.value,
        candidateCollection: this.candidateCollection.value,
        statusId: this.statusId.value
      };
      this.interviewService.interviewAdd(interview)
        .subscribe(response => {
          Helpers.setLoading(false);
          this.error.isError = false;
          this.navigationService.navInterviewList();
          this.isSubmitting = false;
        }, error => {
          Helpers.setLoading(false);
          this.error.isError = true;
          if (error.status === 400) {
            this.error.message = "Conflict interview time of these users: " + error.error + ", please choose again with valid time";
          } else {
            this.error.message = error.error;
          }
          this.isSubmitting = false;
          window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
        });
    } else {
      this.error.isError = true;
      this.error.message = "Please make sure you have filled in all the required fields.";
    }
    console.log('Final error: ', this.error.message);
  }

  validateDate(startDate: Date, endDate: Date): boolean {
    const newDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes());
    if (startDate > newDate && endDate > startDate) {
      return true;
    }
    else {
      return false;
    }
  }

  onSelect(event, d1) {
    const year = this.startTime.value.year;
    const month = this.startTime.value.month - 1;
    const day = this.startTime.value.day;
    const startDate = new Date(year, month, day);
    const endDate = new Date(event.year, event.month - 1, event.day);
    if (startDate > endDate) {
      this.endDateError = true;
    } else {
      this.endDateError = false;
    }
  }
  changeUser(event) {
    this.getAllUsers(event.target.value);
  }

  changeRequest(event) {
    const id = event.target.value;
    this.getAllCandidatesByRequestId(id);
    this.listCandidateCollection = [];
    this.candidateCollection.setValue(this.listCandidateCollection);
  }

  getAllUsers(id) {
    this.subListUser = this.interviewService.getAllUser({ id: id })
      .subscribe(response => {
        this.listUser = response;
        if (this.listUser.length > 0 && this.listUserCollection.length > 0) {
          this.listUser = this.substractUser(this.listUser, this.listUserCollection);
        }
      });
  }

  getAllCandidatesByRequestId(id) {
    this.subListCandidateByRequestId = this.interviewService.getCandidatesByRequestId({ id: id })
      .subscribe(response => {
        this.listCandidateByRequestId = response;
        if (this.listCandidateByRequestId.length > 0 && this.listCandidateCollection.length > 0) {
          this.listCandidateByRequestId = this.substractCandidate(this.listCandidateByRequestId, this.listCandidateCollection);
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
      let index = a1.findIndex(item => item.id === a2[i].id);
      a1.splice(index, 1);
    }
    return a1;
  }

  backToList() {
    this.navigationService.navInterviewList();
  }

  onAddCandidate(id) {
    console.log(id);
    const candidate = this.listCandidateByRequestId.filter(item => item.id === id)[0];
    this.listCandidateCollection.push(candidate);
    this.listCandidateByRequestId.splice(this.listCandidateByRequestId.findIndex(item => item.id === id), 1);
    this.candidateCollection.setValue(this.listCandidateCollection);
  }

  onAddUser(id) {
    const user = this.listUser.filter(item => item.id === id)[0];
    this.listUser.splice(this.listUser.findIndex(item => item.id === id), 1);
    this.listUserCollection.push(user);
    this.userCollection.setValue(this.listUserCollection);
  }

  onDeleteCandidate(id) {
    const candidate = this.listCandidateCollection.filter(item => item.id === id)[0];
    this.listCandidateByRequestId.push(candidate);
    this.listCandidateCollection.splice(this.listCandidateCollection.findIndex(item => item.id === id), 1);
    this.candidateCollection.setValue(this.listCandidateCollection);
  }

  onDeleteUser(id) {
    const user = this.listUserCollection.filter(item => item.id === id)[0];
    this.listUserCollection.splice(this.listUserCollection.findIndex(item => item.id === id), 1);
    this.listUser.push(user);
    this.userCollection.setValue(this.listUserCollection);
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
    if (this.subListUser)
      this.subListUser.unsubscribe();
    if (this.subListStatus)
      this.subListStatus.unsubscribe();
    if (this.subListCandidateByRequestId)
      this.subListCandidateByRequestId.unsubscribe();
    if (this.subListDepartment)
      this.subListDepartment.unsubscribe();
    if (this.subListRequest)
      this.subListRequest.unsubscribe();
  }
}
