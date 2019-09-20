import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { select, NgRedux } from 'ng2-redux';
import { IRootState } from '../../../core/redux/root.store';
import { Candidate } from '../../../model/candidate.class';
import { Subscription } from 'rxjs';
import { RequestCenterService } from '../../../request-management/services/request-center.service';
import { denormalizeCandidateArray } from '../../../core/redux/domain/domain.normalization';
import { CANDIDATE_TAB_SELECT } from '../../../core/redux/ui/request-center/request-center-ui.action';
import { CURRENT_CANDIDATE_CHANGE } from '../../../core/redux/app/request-center/request-center.action';
import { Interview } from '../../../model/interview.class';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.css']
})
export class CandidateListComponent implements OnInit {

  @Input() interview: Interview;
  @select((s: IRootState) => s.uiStore.requestCenterUiStore.currentCandidateTab) currentCandidateTab$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentQualifiedCandidateIds) currentQualifiedCandidateIds$;
 
  @select((s: IRootState) => s.appStore.requestCenterStore.selectedCandidateIds) selectedCandidateIds$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentCandidateId) currentCandidateId$;

  qualifiedCandidates: Candidate[];
 
  selectedCandidateIds: number[];

  subCurrentQualifiedCandidateIds$: Subscription;
 
  subCurrentTab: Subscription;

  constructor(
    private requestService: RequestCenterService,
    private ngRedux: NgRedux<IRootState>,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
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
   
  }

  switchTab($event) {
    this.ngRedux.dispatch({
      type: CANDIDATE_TAB_SELECT,
      payload: $event
    });
  }

  selectCandidate(candidate: Candidate) {
    this.ngRedux.dispatch({
      type: CURRENT_CANDIDATE_CHANGE,
      payload: candidate.id
    });
  }

  checkCandidate(candidate: Candidate) {
    const index = this.selectedCandidateIds.findIndex(id => id === candidate.id);
    if (index > -1) {
      this.selectedCandidateIds.splice(index, 1);
    } else {
      this.selectedCandidateIds.push(candidate.id);
    }
  }
  ngOnDestroy() {
    
    if (this.subCurrentQualifiedCandidateIds$) {
      this.subCurrentQualifiedCandidateIds$.unsubscribe();
    }
    if (this.subCurrentTab) {
      this.subCurrentTab.unsubscribe();
    }
  }
}
