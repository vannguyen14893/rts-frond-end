import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from '../../../../../node_modules/rxjs';
import { RequestManagementService } from '../../services/request-management.service';

@Component({
  selector: 'app-request-log-list',
  templateUrl: './request-log-list.component.html',
  styleUrls: ['./request-log-list.component.css']
})
export class RequestLogListComponent implements OnInit {
  requestLogs;
  @Input('urlRequestId') urlRequestId;

  private subListLogsRequest: Subscription;

  constructor(
    private requestService: RequestManagementService,
  ) {
  }

  ngOnInit() {
    this.subListLogsRequest = this.requestService.getAllLogsRequest(this.urlRequestId).subscribe(response => {
      this.requestLogs = response.content;
      
    });
  }

  ngOnDestroy() {
    if (this.subListLogsRequest) {
      this.subListLogsRequest.unsubscribe();
    }
  }
}
