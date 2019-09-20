import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActionCreatorService } from '../../../../core/services/action-creator.service';

@Component({
  selector: 'app-submit-request',
  templateUrl: './submit-request.component.html',
  styleUrls: ['./submit-request.component.css']
})
export class SubmitRequestComponent implements OnInit, OnDestroy {

  constructor(
    private ac: ActionCreatorService
  ) { }

  ngOnInit() {
  }

  submit() {
    // TODO
  }

  ngOnDestroy() {
    this.ac.closeModal();
  }

}
