import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { select, NgRedux } from 'ng2-redux';
import { IRootState } from '../../../core/redux/root.store';
import { Candidate } from '../../../model/candidate.class';
import { Observable } from 'rxjs/Observable';
import { denormalizeCandidate, denormalizeLogArray } from '../../../core/redux/domain/domain.normalization';
import { Interview } from '../../../model/interview.class';
import { Log } from '../../../model/log.class';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {

  @Input() interview: Interview;
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
