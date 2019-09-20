import { Subscription } from 'rxjs/Subscription';
import { Candidate } from './../../../model/candidate.class';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { select, NgRedux } from 'ng2-redux';
import { RequestCenterService } from '../../services/request-center.service';
import { Observable } from 'rxjs/Observable';
import { IRootState } from '../../../core/redux/root.store';
import { Log } from '../../../model/log.class';
import { denormalizeLogArray } from '../../../core/redux/domain/domain.normalization';

@Component({
  selector: 'app-candidate-log-list',
  templateUrl: './candidate-log-list.component.html',
  styleUrls: ['./candidate-log-list.component.css']
})
export class CandidateLogListComponent implements OnInit, AfterViewChecked {
  @select((s: IRootState) => s.appStore.requestCenterStore.currentCandidateLogIds) candidateLogsIds$;
  @ViewChild('scrollLogs') private myScrollContainer: ElementRef;

  currentCandidateLogs: Log[];

  constructor(
    private ngRedux: NgRedux<IRootState>
  ) { }

  ngOnInit() {
    this.candidateLogsIds$.subscribe(ids => {
        if (ids.length > 0) {
          this.currentCandidateLogs = denormalizeLogArray(ids, this.ngRedux.getState()['domainStore']);
        }
        this.scrollToBottom();
      });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}
