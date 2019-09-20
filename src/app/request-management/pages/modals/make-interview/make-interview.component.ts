import { ModalMessage } from './../../../../model/modal-message.class';
import { ActionCreatorService } from '../../../../core/services/action-creator.service';
import { denormalizeCandidateArray, denormalizeUserArray } from '../../../../core/redux/domain/domain.normalization';
import { IRootState } from '../../../../core/redux/root.store';
import { Candidate } from '../../../../model/candidate.class';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import { Validators, FormControl } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { RequestCenterService } from '../../../services/request-center.service';
import { select, NgRedux } from 'ng2-redux';
import { Interview } from '../../../../model/interview.class';
import { User } from '../../../../model/user.class';
import { CommonValidator } from '../../../../shared/custom-validator/common.validator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-make-interview',
  templateUrl: './make-interview.component.html',
  styleUrls: ['./make-interview.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class MakeInterviewComponent implements OnInit {

  @select((s: IRootState) => s.appStore.requestCenterStore.selectedCandidateIds) selectedCandidateIds$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentCandidateId) currentCandidateId$;
  @select((s: IRootState) => s.domainStore.userIds) userIds$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentQualifiedCandidateIds) currentQualifiedCandidateIds$;
  @select((s: IRootState) => s.uiStore.requestCenterUiStore.currentCandidateTab) currentCandidateTab$;
  allUsers: User[] = [];

  selectedCandidates: Candidate[];
  qualifiedCandidates: Candidate[];
  subCurrentQualifiedCandidateIds$: Subscription;
  selectedCandidateIds: number[];
  subCurrentTab: Subscription;
  tabs = [
    {
      tabName: 'Qualified',
      badgeNumber: 0,
      isActive: true
    },
    {
      tabName: 'Disqualified',
      badgeNumber: 0,
      isActive: false
    }
  ];

  form: FormGroup;
  today: NgbDate;

  times = [
    '8:00',
    '8:30',
    '9:00',
    '9:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30'
  ];
  durations = [
    { value: 15, display: '15 minutes' },
    { value: 30, display: '30 minutes' },
    { value: 45, display: '45 minutes' },
    { value: 60, display: '1 hour' },
    { value: 90, display: '90 minutes' },
    { value: 120, display: '2 hours' },
    { value: 240, display: '4 hours' },
    { value: 480, display: '8 hours' },
  ];

  message: ModalMessage;

  isSubmitted = false;

  constructor(
    private requestService: RequestCenterService,
    private fb: FormBuilder,
    private ngRedux: NgRedux<IRootState>,
    private ac: ActionCreatorService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const now = new Date();
    this.today = new NgbDate(now.getFullYear(), now.getMonth() + 1, now.getDate());

    this.buildForm();

    this.currentCandidateId$.subscribe(id => {
        this.selectedCandidates = denormalizeCandidateArray([id], this.ngRedux.getState()['domainStore']);
    });

    this.selectedCandidateIds$.subscribe(ids => {
      if (ids.length > 0) {
        this.selectedCandidates = denormalizeCandidateArray(ids, this.ngRedux.getState()['domainStore']);
      }
    });

    this.userIds$.subscribe(ids => {
      if (ids.length > 0) {
        this.allUsers = denormalizeUserArray(ids, this.ngRedux.getState()['domainStore']);
      }
    });

    this.subCurrentQualifiedCandidateIds$ = this.currentQualifiedCandidateIds$.subscribe(ids => {
      if (ids.length === 0) {
        this.qualifiedCandidates = [];
      } else {
        this.qualifiedCandidates = denormalizeCandidateArray(ids, this.ngRedux.getState()['domainStore']);
      }
    });
   
    this.selectedCandidateIds$.subscribe(ids => {
      this.selectedCandidateIds = ids;
    });
    this.subCurrentTab = this.currentCandidateTab$.subscribe(tabName => {
      let [tab0, tab1] = this.tabs;
      if (this.tabs[0].tabName === tabName) {
        tab0.isActive = true;
        tab1.isActive = false;
      } else {
        tab0.isActive = false;
        tab1.isActive = true;
      }
      this.tabs = [tab0, tab1];
      this.cdr.detectChanges();
    });

    this.message = new ModalMessage ('success', '');
    
    
  }

  buildForm() {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      date: new FormControl(new Date(), Validators.required),
      time: new FormControl('', Validators.required),
      duration: new FormControl('', Validators.required),
      userCollection: new FormControl(),
      candidateCollection: new FormControl(),
      note: new FormControl()
    });
  }
  submit() {
    this.message = new ModalMessage ('info', '');
    const interview = new Interview();
    interview.location = (this.location.value || '').trim();
    interview.title = (this.title.value || '').trim();
    interview.candidateCollection = this.form.get('candidateCollection').value
    interview.userCollection = this.form.get('userCollection').value;
    const startDate: Date = this.convertNgbDateToDate(this.date.value);
    const startHour = parseInt(String(this.time.value).split(':')[0], 10);
    const startMinute = parseInt(String(this.time.value).split(':')[1], 10);
    const msDuration = this.duration.value * 60 * 1000;
    interview.startTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startHour, startMinute);
    interview.endTime = new Date(interview.startTime.valueOf() + msDuration);
    this.requestService.makeInterview(interview).subscribe((res: Interview) => {
      this.isSubmitted = true;
      this.ac.fetchCandidateInterviewsAndSelectDefault();
      this.requestService.closeModal();
    }, err => {
      this.ac.fetchCandidateInterviewsAndSelectDefault();
      this.message = new ModalMessage ('error', this.findUserNamesByIDs(err.error).join(', ') + ' had a time conflict');
      this.time.setErrors({conflict: true, 'invalid': true });
    });
  }

  findUserNamesByIDs (ids) {
    return this.allUsers.reduce((fullName, user) => {
      if (ids.includes(user.id)) {
        fullName.push(user.fullName);
      }
      return fullName; }, []);
  }

  convertNgbDateToDate(ngbDate: NgbDate): Date {
    return new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
  }

  onCallBack() {
    if (this.form.dirty) {
      if (confirm()) {
        this.requestService.closeModal();
      }
    } else {
      this.requestService.closeModal();
    }
  }

  closeModal() {
    this.requestService.closeModal();
  }

  get title() {
    return this.form.get('title');
  }
  get location() {
    return this.form.get('location');
  }
  get userCollection() {
    return this.form.get('userCollection');
  }
  get date() {
    return this.form.get('date');
  }
  get time() {
    return this.form.get('time');
  }
  get duration() {
    return this.form.get('duration');
  }
  get note() {
    return this.form.get('note');
  }

}
