import { Candidate } from '../../../../model/candidate.class';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RequestCenterService } from '../../../services/request-center.service';
import { IRootState } from '../../../../core/redux/root.store';
import { select } from 'ng2-redux';
import { StoredProcedureService } from '../../../services/stored-procedure.service';

@Component({
  selector: 'app-edit-candidate',
  templateUrl: './edit-candidate.component.html',
  styleUrls: ['./edit-candidate.component.css']
})
export class EditCandidateComponent implements OnInit {

  @select((s: IRootState) => s.appStore.requestCenterStore.currentCandidateId) currentCandidateId$;
  @ViewChild('modal') modal: ElementRef;
  private modalRef: NgbModalRef;

  currentCandidate: Candidate;

  constructor(
    private modalService: NgbModal,
    private requestService: RequestCenterService,
    private sp: StoredProcedureService
  ) { }

  ngOnInit() {
    this.currentCandidateId$.subscribe(id => {
      if (id !== 0) {
        this.currentCandidate = this.sp.getCandidate(id);
      }
    });
    this.modalRef = this.modalService.open(this.modal, { size: 'lg' });
    this.modalRef.result.then(result => {
      this.requestService.closeModal();
    }, reason => {
      this.requestService.closeModal();
    });
  }
  closeModal() {
    this.modalRef.close('Cv updated');
  }

}
