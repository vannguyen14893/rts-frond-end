import { Component, OnInit, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { IRootState } from './../../../../core/redux/root.store';
import { select } from 'ng2-redux';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StoredProcedureService } from '../../../../core/services/stored-procedure.service';
import { RequestManagementService } from '../../../services/request-management.service';
import { ActionCreatorService } from '../../../../core/services/action-creator.service';
import { CommonValidator } from '../../../../shared/custom-validator/common.validator';
import { Request } from './../../../../model/request.class';

@Component({
  selector: 'app-close-request',
  templateUrl: './close-request.component.html',
  styleUrls: ['./close-request.component.css']
})

export class CloseRequestComponent implements OnInit, AfterViewInit, OnDestroy {

  @select((s: IRootState) => s.appStore.closeRequestStore.closedRequestId) closedRequestId$;
  @Output() closed$ = new EventEmitter<void>();

  form: FormGroup;

  closedRequest: Request;

  private subClosedRequest: Subscription;

  constructor(
    private sp: StoredProcedureService,
    private requestManagementService: RequestManagementService,
    private ac: ActionCreatorService
  ) {
  }

  ngOnInit() {
    this.closedRequestId$.subscribe(id => {
      this.closedRequest = this.sp.getRequest(id);
    });
    // this.buildForm();
  }

  // buildForm() {
  //   this.form = new FormGroup({
  //     reason : new FormControl('', [CommonValidator.notEmpty])
  //   });
  // }

  close() {
    console.log('goi roi ');
    this.subClosedRequest = this.requestManagementService.close(this.closedRequest)
      .subscribe((response: Request) => {
        this.closed$.emit();
        this.ac.closeModal();
      }, err => {
        console.log(err, '+++++++++');
      });
  }

  no() {
    this.ac.closeModal();
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.ac.closeModal();
  }
}
