import { denormalizeCandidate } from './../../../core/redux/domain/domain.normalization';
import { Observable } from 'rxjs/Observable';
import { IRootState } from './../../../core/redux/root.store';
import { Candidate } from './../../../model/candidate.class';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { select, NgRedux } from 'ng2-redux';
import { RequestCenterService } from '../../services/request-center.service';
import { Interview } from '../../../model/interview.class';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentListComponent implements OnInit {

  @select((s: IRootState) => s.appStore.requestCenterStore.currentCandidateId) currentCandidateId$;
  @select((s: IRootState) => s.domainStore.candidates) candidates$;

  currentCandidate: Candidate;

  constructor(
    private ngRedux: NgRedux<IRootState>,
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

}
