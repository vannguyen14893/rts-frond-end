import { CANDIDATE_TAB_SELECT, CANDIDATE_STATUS_CHANGE} from '../../../../core/redux/ui/request-center/request-center-ui.action';
import { StoredProcedureService } from '../../../services/stored-procedure.service';
import { denormalizeCandidate, normalizeCandidate } from '../../../../core/redux/domain/domain.normalization';
import { Observable } from 'rxjs/Observable';
import { CANDIDATE_STATUS } from '../../../../shared/constants/status.constant';
import { Candidate } from '../../../../model/candidate.class';
import { Component, OnInit, } from '@angular/core';
import { RequestCenterService } from '../../../services/request-center.service';
import { select, NgRedux } from 'ng2-redux';
import { Status } from '../../../../model/status.class';
import { IRootState } from '../../../../core/redux/root.store';
import { CANDIDATE_UPDATE } from '../../../../core/redux/domain/domain.action';
import {
  CURRENT_CANDIDATE_RESET, SELECTED_CANDIDATES_RESET, FILTER_CANDIDATES
} from '../../../../core/redux/app/request-center/request-center.action';
import { ActionCreatorService } from '../../../../core/services/action-creator.service';

@Component({
  selector: 'app-reject-candidate',
  templateUrl: './reject-candidate.component.html',
  styleUrls: ['./reject-candidate.component.css']
})
export class RejectCandidateComponent implements OnInit {

  @select((s: IRootState) => s.appStore.requestCenterStore.currentCandidateId) currentCandidateId$;
  @select((s: IRootState) => s.domainStore.candidates) candidates$;
  @select((s: IRootState) => s.domainStore.candidateStatuses) candidateStatuses$;

  currentCandidate: Candidate;

  constructor(
    private requestService: RequestCenterService,
    private ngRedux: NgRedux<IRootState>,
    private sp: StoredProcedureService,
    private ac: ActionCreatorService
  ) { }

  ngOnInit() {
    Observable.combineLatest(
      this.candidates$,
      this.currentCandidateId$
    ).subscribe(res => {
      if (res[1] !== 0) {
        this.currentCandidate = denormalizeCandidate(res[0][res[1]], this.ngRedux.getState()['domainStore']);
      }
    });
  }
  submit() {
    this.requestService.changeCandidateStatus([this.currentCandidate], CANDIDATE_STATUS.CLOSE_ID).subscribe(res => {
      // Update candidate
      this.currentCandidate.statusId = this.sp.getCandidateStatus(CANDIDATE_STATUS.CLOSE_ID);
      this.ngRedux.dispatch({
        type: CANDIDATE_UPDATE,
        payload: normalizeCandidate(this.currentCandidate)
      });
      // Update logs
      this.ac.fetchCurrentCandidateLogs();
      this.ngRedux.dispatch({
        type: FILTER_CANDIDATES,
        payload: this.sp.filterCandidates()
      });
      this.ngRedux.dispatch({
        type: CANDIDATE_TAB_SELECT,
        payload: CANDIDATE_STATUS.DISQUALIFIED
      });
      this.requestService.closeModal();
    }, err => console.log(err));
  }

}
