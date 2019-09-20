import { denormalizeCandidate } from './../../../core/redux/domain/domain.normalization';
import { Observable } from 'rxjs/Observable';
import { Candidate } from './../../../model/candidate.class';
import { IRootState } from './../../../core/redux/root.store';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { select, NgRedux } from 'ng2-redux';
import { CvService } from '../../../cv/service/cv.service';

@Component({
  selector: 'app-candidate-info',
  templateUrl: './candidate-info.component.html',
  styleUrls: ['./candidate-info.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class CandidateInfoComponent implements OnInit {

  @select((s: IRootState) => s.appStore.requestCenterStore.currentCandidateId) currentCandidateId$;
  @select((s: IRootState) => s.domainStore.candidates) candidates$;

  currentCandidate: Candidate;
  constructor(
    private ngRedux: NgRedux<IRootState>,
    private cvService: CvService
  ) { }

  ngOnInit() {
    Observable.combineLatest(
      this.candidates$,
      this.currentCandidateId$,
    ).subscribe(res => {
      this.currentCandidate = denormalizeCandidate(res[0][res[1]], this.ngRedux.getState()['domainStore']);
    });
  }

  viewFileCv(path: string) {
    this.cvService.viewFileCv(path)
    // window.open(environment.baseUrl + '/public/' + path);
  }

}
