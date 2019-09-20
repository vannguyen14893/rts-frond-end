import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestCenterService } from '../../../services/request-center.service';

@Component({
  selector: 'app-view-request-detail',
  templateUrl: './view-request-detail.component.html',
  styleUrls: ['./view-request-detail.component.css']
})
export class ViewRequestDetailComponent implements OnInit {

  @ViewChild('modal') modal: ElementRef;
  modalRef: NgbModalRef;
  
  constructor(
    private modalService: NgbModal,
    private requestService: RequestCenterService,
  ) { }

  ngOnInit() {
    this.modalRef = this.modalService.open(this.modal, {
      backdrop: 'static',
      size: 'lg'
    });
    this.modalRef.result.then(result => {
      this.requestService.closeModal();
    }, reason => {
      this.requestService.closeModal();
    });
  }

}
