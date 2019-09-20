import { CANDIDATE_STATUS } from '../../../../shared/constants/status.constant';
import { CANDIDATE_STATUS_CHANGE, CANDIDATE_TAB_SELECT } from '../../../../core/redux/ui/request-center/request-center-ui.action';
import { CANDIDATE_UPDATE } from '../../../../core/redux/domain/domain.action';
import { denormalizeCandidate, denormalizeCandidateStatus, normalizeCandidate } from '../../../../core/redux/domain/domain.normalization';
import { Observable } from 'rxjs/Observable';
import { Candidate } from '../../../../model/candidate.class';
import { select, NgRedux } from 'ng2-redux';
import { Component, OnInit, } from '@angular/core';
import { RequestCenterService } from '../../../services/request-center.service';
import { Status } from '../../../../model/status.class';
import { IRootState } from '../../../../core/redux/root.store';
import { ActionCreatorService } from '../../../../core/services/action-creator.service';
import { StoredProcedureService } from '../../../../core/services/stored-procedure.service';
import { FILTER_CANDIDATES } from '../../../../core/redux/app/request-center/request-center.action';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-change-candidate-status',
  templateUrl: './change-candidate-status.component.html',
  styleUrls: ['./change-candidate-status.component.css']
})
export class ChangeCandidateStatusComponent implements OnInit {

  @select((s: IRootState) => s.appStore.changeCandidateStatusStore.nextCandidateStatusId) nextCandidateStatusId$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentCandidateId) currentCandidateId$;

  nextStatus: Status;
  currentCandidate: Candidate;
  form: FormGroup;
  show = false;

  constructor(
    private requestService: RequestCenterService,
    private ngRedux: NgRedux<IRootState>,
    private sp: StoredProcedureService,
    private ac: ActionCreatorService
    
  ) { }

  buildForm() {
    this.form = new FormGroup({
      onboardDate: new FormControl(null, Validators.required),
    });
  }

  ngOnInit() {
    this.buildForm();
    this.currentCandidateId$.subscribe(id => {
        if (id !== 0) {
          this.currentCandidate = this.sp.getCandidate(id);
        }
      });
    this.nextCandidateStatusId$.subscribe(id => {
      if (id !== 0) {
        this.nextStatus = this.sp.getCandidateStatus(id);
      }
    });
    if(this.nextStatus.title == "Onboard"){
      this.show = true;
    }
  }

  submit() {
    if(this.onboardDate.value != null){
      const date:Date =  this.convertNgbDateToDate(this.onboardDate.value);
      this.currentCandidate.onboardDate = date;
    }
    
    this.requestService.changeCandidateStatus([this.currentCandidate], this.nextStatus.id).subscribe(res => {
      // Update candidate
      this.currentCandidate.statusId = this.nextStatus;
      this.ngRedux.dispatch({
        type: CANDIDATE_UPDATE,
        payload: normalizeCandidate(this.currentCandidate)
      });
      // Update logs
      this.ac.fetchCurrentCandidateLogs();
      // Update currentCandidateStatus
      if (this.nextStatus.id !== CANDIDATE_STATUS.CLOSE_ID) {
        this.ngRedux.dispatch({
          type: CANDIDATE_STATUS_CHANGE,
          payload: this.currentCandidate.statusId.title
        });
        this.ngRedux.dispatch({
          type: FILTER_CANDIDATES,
          payload: this.sp.filterCandidates()
        });
        this.ngRedux.dispatch({
          type: CANDIDATE_TAB_SELECT,
          payload: CANDIDATE_STATUS.QUALIFIED
        });
      } else {
        this.ngRedux.dispatch({
          type: FILTER_CANDIDATES,
          payload: this.sp.filterCandidates()
        });
        this.ngRedux.dispatch({
          type: CANDIDATE_TAB_SELECT,
          payload: CANDIDATE_STATUS.DISQUALIFIED
        });
      }
      this.requestService.closeModal();
    }, err => console.log(err));
  }
  convertNgbDateToDate(ngbDate: NgbDate): Date {
    return new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
  }
  get onboardDate() {
    return this.form.get('onboardDate');
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

}
