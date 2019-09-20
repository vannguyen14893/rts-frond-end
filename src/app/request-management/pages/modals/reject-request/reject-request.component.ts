import { FormGroup, FormControl } from '@angular/forms';
import { Request } from './../../../../model/request.class';
import { IRootState } from './../../../../core/redux/root.store';
import { Component, OnInit, Output, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { select } from 'ng2-redux';
import { StoredProcedureService } from '../../../../core/services/stored-procedure.service';
import { Subscription } from 'rxjs/Subscription';
import { RequestManagementService } from '../../../services/request-management.service';
import { CommonValidator } from '../../../../shared/custom-validator/common.validator';
import { ActionCreatorService } from '../../../../core/services/action-creator.service';

@Component({
  selector: 'app-reject-request',
  templateUrl: './reject-request.component.html',
  styleUrls: ['./reject-request.component.css']
})
export class RejectRequestComponent implements OnInit, AfterViewInit, OnDestroy {

  @select((s: IRootState) => s.appStore.rejectRequestStore.rejectedRequestId) rejectedRequestId$;
  @Output() rejected$ = new EventEmitter<void>();

  form: FormGroup;

  rejectedRequest: Request;

  private subRejectRequest: Subscription;

  constructor(
    private sp: StoredProcedureService,
    private requestManagementService: RequestManagementService,
    private ac: ActionCreatorService
  ) { }

  ngOnInit() {
    this.rejectedRequestId$.subscribe(id => {
      this.rejectedRequest = this.sp.getRequest(id);
    });
    this.buildForm();
  }
  buildForm() {
    this.form = new FormGroup({
      reason: new FormControl('', [CommonValidator.notEmpty])
    });
  }

  reject() {
    this.rejectedRequest.rejectReason = this.reason.value.trim();
    this.subRejectRequest = this.requestManagementService.setRejectRequest(this.rejectedRequest, this.rejectedRequest.id)
      .subscribe((response: Request) => {
        this.rejected$.emit();
        this.ac.closeModal();
      }, err => {
        // TODO
        console.log('REJECTED FAILED', err);
      });
  }

  get reason() {
    return this.form.get('reason');
  }

  ngAfterViewInit() {
    window.document.getElementById('rejectReason').focus();
  }

  ngOnDestroy() {
    this.ac.closeModal();
  }

}
