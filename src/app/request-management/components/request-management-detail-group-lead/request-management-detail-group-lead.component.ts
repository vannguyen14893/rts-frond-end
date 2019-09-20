import { Helpers } from './../../../helpers';
import { NavigationService } from './../../../core/services/navigation.service';
import { Subscription } from 'rxjs/Subscription';
import { Request } from './../../../model/request.class';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/switchMap';
import { RequestManagementService } from '../../services/request-management.service';

declare var $: any;
@Component({
  selector: 'app-request-management-detail-group-lead',
  templateUrl: './request-management-detail-group-lead.component.html',
  styleUrls: ['./request-management-detail-group-lead.component.css']
})
export class RequestManagementDetailGroupLeadComponent implements OnInit, OnDestroy {

  requestId;
  request: Request;
  subRequest: Subscription;
  // rejectReason: string;

  errorReason = true;

  response = {
    isSubmitting: false,
    isError: false,
    isSuccess: false,
    message: ''
  }

  ngOnDestroy(): void {
    if (this.subRequest)
      this.subRequest.unsubscribe();
  }
  constructor(
    private requestManagementService: RequestManagementService,
    private navigationService: NavigationService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.subRequest = Observable.combineLatest([
      this.route.paramMap
    ]).switchMap(combined => {
      this.requestId = combined[0].get('id');

      if (isNaN(this.requestId))
        this.navigationService.navErrorNotFound();

      return this.requestManagementService.getOne(this.requestId);
    }).subscribe(request => {
      this.request = request;
    })
  }

  navRequestList() {
    this.navigationService.navRequestList();
  }

  onShowApproveModal() {
    this.response.message = '';
    $('#m_modal_approve').modal({ show: true, backdrop: 'static' });
  }
  onShowRejectModal() {
    this.response.message = '';
    $('#m_modal_reject_reason').modal({ show: true, backdrop: 'static' });
  }

  onReject(reason: string) {
    this.response.isSubmitting = true;
    this.request.rejectReason = reason;
    Helpers.setLoading(true);
    this.requestManagementService.setRejectRequest(this.request, this.requestId)
      .subscribe((response: Request) => {
        if (response.requestStatusId.title === 'Closed') {
          this.errorReason = false;
          this.response.isSubmitting = false;
          this.response.isSuccess = true;
          this.response.isError = false;
          this.response.message = "This request has been rejected successful";
          setTimeout(()=> {
            Helpers.setLoading(false);
            $('#m_modal_reject_reason').modal('toggle');
            this.navigationService.navRequestList();
          },2000);
        }
      }, err => {
        this.response.isSubmitting = false;
        this.response.isSuccess = false;
        this.response.isError = true;
        this.response.message = err.error;
        Helpers.setLoading(false);
      });
  }

  validateRejectReason(event: string) {
    if (event.trim() === '') {
      this.errorReason = true;
    } else {
      this.errorReason = false;
    }
  }

  onApprove() {
    Helpers.setLoading(true);
    this.response.isSubmitting = true;
    this.requestManagementService.setApproveRequest(this.request, this.requestId)
      .subscribe((response: Request) => {
        if (response.requestStatusId.title === 'Approved') {
          this.response.isSubmitting = false;
          this.response.isSuccess = true;
          this.response.isError = false;
          this.response.message = "This request has been approved successful";
          setTimeout(()=> {
            Helpers.setLoading(false);
            $('#m_modal_approve').modal('toggle');
            this.navigationService.navRequestList();
          },2000);
        }
      }, err => {
        Helpers.setLoading(false);
        this.response.isSubmitting = false;
        this.response.isSuccess = false;
        this.response.isError = true;
        this.response.message = err.error;
      });
  }

  onCancel() {
    this.navigationService.navRequestList();
  }

  showApproveButton(): boolean {
    if (this.request && this.request.requestStatusId.title === 'Pending')
      return true;
    return false;
  }
  showRejectButton(): boolean {
    if (this.request && this.request.requestStatusId.title === 'Pending')
      return true;
    return false;
  }
}
