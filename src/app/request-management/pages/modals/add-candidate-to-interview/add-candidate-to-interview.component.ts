import { AfterViewInit, AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';
import { denormalizeInterview, denormalizeCandidateArray, normalizeInterview } from '../../../../core/redux/domain/domain.normalization';
import { ModalMessage } from '../../../../model/modal-message.class';
import { Candidate } from '../../../../model/candidate.class';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RequestCenterService } from '../../../services/request-center.service';
import { select, NgRedux } from 'ng2-redux';
import { Interview } from '../../../../model/interview.class';
import { IRootState } from '../../../../core/redux/root.store';
import { INTERVIEW_UPDATE } from '../../../../core/redux/domain/domain.action';
import { ActionCreatorService } from '../../../../core/services/action-creator.service';

@Component({
  selector: 'app-add-candidate-to-interview',
  templateUrl: './add-candidate-to-interview.component.html',
  styleUrls: ['./add-candidate-to-interview.component.css']
})
export class AddCandidateToInterviewComponent implements OnInit, AfterViewInit {

  @select((s: IRootState) => s.appStore.requestCenterStore.currentInterviewId) currentInterviewId$;
  @select((s: IRootState) => s.domainStore.interviews) interviews$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentRequestCandidateIds) currentRequestCandidateIds$;

  currentRequestCandidates: Candidate[];
  sourceCandidates: Candidate[] = [];
  searchResults: Candidate[] = [];
  searchInput: string;
  addedCandidates: Candidate[] = [];

  currentInterview: Interview;

  message: ModalMessage;

  constructor(
    private modalService: NgbModal,
    private requestService: RequestCenterService,
    private ngRedux: NgRedux<IRootState>,
    private actionCreatorService: ActionCreatorService
  ) { }

  ngOnInit() {
    Observable.combineLatest(
      this.interviews$,
      this.currentInterviewId$,
      this.currentRequestCandidateIds$
    ).subscribe(res => {
      if (this.currentInterviewId$ !== 0) {
        this.currentInterview = denormalizeInterview(res[0][res[1]], this.ngRedux.getState()['domainStore']);
      }
      if (res[2].length > 0) {
        this.currentRequestCandidates = denormalizeCandidateArray(res[2], this.ngRedux.getState()['domainStore']);
        this.sourceCandidates = this.currentRequestCandidates
          .filter(c => this.currentInterview.candidateCollection.findIndex(c1 => c1.id === c.id) < 0);
        this.searchResults = this.sourceCandidates;
      }
    });
  }

  ngAfterViewInit() {
    window.document.getElementById('search-input').focus();
  }
  search() {
    this.searchResults = this.sourceCandidates.filter(c => c.cvId.fullName.toLowerCase().search(this.searchInput.toLowerCase()) > -1);
  }
  checkCandidate(candidate: Candidate) {
    if (candidate.selected === undefined) {
      candidate.selected = true;
    } else {
      candidate.selected = !candidate.selected;
    }
    const index = this.addedCandidates.findIndex(c => c.id === candidate.id);
    index > -1 ? this.addedCandidates.splice(index, 1) : this.addedCandidates.push(candidate);
  }
  submit() {
    // Gọi api
    this.requestService.addCandidateToInterview(this.currentInterview.id, this.addedCandidates).subscribe(res => {
      // Đóng modal
      this.requestService.closeModal();
      // Cập nhật domainStore
      this.currentInterview.candidateCollection.push(...this.addedCandidates);
      this.ngRedux.dispatch({
        type: INTERVIEW_UPDATE,
        payload: normalizeInterview(this.currentInterview)
      });
      // Load lại candidate logs
      this.actionCreatorService.fetchCurrentCandidateLogs();
    }, err => {
      if (err.status === 500) {
        this.message.type = 'error';
        this.message.message = 'Internal Server Error.';
      }
    });
  }

}
