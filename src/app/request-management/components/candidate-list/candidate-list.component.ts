import { CURRENT_CANDIDATE_CHANGE } from './../../../core/redux/app/request-center/request-center.action';
import { denormalizeCandidate, denormalizeCandidateArray } from './../../../core/redux/domain/domain.normalization';
import { Candidate } from './../../../model/candidate.class';
import { CANDIDATE_TAB_SELECT } from './../../../core/redux/ui/request-center/request-center-ui.action';
import { IRootState } from './../../../core/redux/root.store';
import { RequestCenterService } from './../../services/request-center.service';
import { OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from 'ng2-redux';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateListComponent implements OnInit, OnDestroy {

  @select((s: IRootState) => s.uiStore.requestCenterUiStore.currentCandidateTab) currentCandidateTab$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentQualifiedCandidateIds) currentQualifiedCandidateIds$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentdisqualifiedCandidateIds) currentdisqualifiedCandidateIds$;
  @select((s: IRootState) => s.appStore.requestCenterStore.selectedCandidateIds) selectedCandidateIds$;
  @select((s: IRootState) => s.appStore.requestCenterStore.currentCandidateId) currentCandidateId$;
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
  qualifiedCandidates: Candidate[];
  disqualifiedCandidates: Candidate[];
  selectedCandidateIds: number[];

  subCurrentQualifiedCandidateIds$: Subscription;
  subCurrentdisqualifiedCandidateIds$: Subscription;
  subCurrentTab: Subscription;

  constructor(
    private requestService: RequestCenterService,
    private ngRedux: NgRedux<IRootState>,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.subCurrentQualifiedCandidateIds$ = this.currentQualifiedCandidateIds$.subscribe(ids => {
      let [tab0, tab1] = this.tabs;
      if (ids.length === 0) {
        this.qualifiedCandidates = [];
        tab0.badgeNumber = 0;
      } else {
        this.qualifiedCandidates = denormalizeCandidateArray(ids, this.ngRedux.getState()['domainStore']);
        tab0.badgeNumber = ids.length;
      }
      this.tabs = [tab0, tab1];
      this.cdr.detectChanges();
    });
    this.subCurrentdisqualifiedCandidateIds$ = this.currentdisqualifiedCandidateIds$.subscribe(ids => {
      let [tab0, tab1] = this.tabs;
      if (ids.length === 0) {
        this.disqualifiedCandidates = [];
        tab1.badgeNumber = 0;
      } else {
        this.disqualifiedCandidates = denormalizeCandidateArray(ids, this.ngRedux.getState()['domainStore']);
        tab1.badgeNumber = ids.length;
      }
      this.tabs = [tab0, tab1];
      this.cdr.detectChanges();
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
    if (this.subCurrentdisqualifiedCandidateIds$) {
      this.subCurrentdisqualifiedCandidateIds$.unsubscribe();
    }
    if (this.subCurrentQualifiedCandidateIds$) {
      this.subCurrentQualifiedCandidateIds$.unsubscribe();
    }
    if (this.subCurrentTab) {
      this.subCurrentTab.unsubscribe();
    }
  }

}
