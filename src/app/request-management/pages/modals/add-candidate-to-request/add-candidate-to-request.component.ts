import { StoredProcedureService } from './../../../services/stored-procedure.service';
import { Component, OnInit, } from '@angular/core';
import { RequestCenterService } from '../../../services/request-center.service';
import { IRootState } from '../../../../core/redux/root.store';
import { select } from 'ng2-redux';
import { Request } from '../../../../model/request.class';

@Component({
  selector: 'app-add-candidate-to-request',
  templateUrl: './add-candidate-to-request.component.html',
  styleUrls: ['./add-candidate-to-request.component.css']
})
export class AddCandidateToRequestComponent implements OnInit {

  @select((s: IRootState) => s.appStore.requestCenterStore.currentRequestId) currentRequestId$;

  currentRequest: Request;

  constructor(
    private requestService: RequestCenterService,
    private sp: StoredProcedureService
  ) { }

  ngOnInit() {

    // Lấy request hiện tại
    this.currentRequestId$.subscribe(id => {
      if (id !== 0) {
        this.currentRequest = this.sp.getRequest(id);
      } else {
        this.currentRequest = {};
      }
    });
  }
  closeModal() {
    this.requestService.closeModal();
  }

}
