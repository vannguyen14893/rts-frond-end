import { MODAL_OPEN } from './../../../core/redux/ui/request-center/request-center-ui.action';
import { Component, OnInit, OnDestroy, Input, EventEmitter, Output, AfterViewInit, ContentChild, ElementRef } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IRootState } from '../../../core/redux/root.store';

declare var $: any;

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {

  @Input() header: string; // Modal title
  @Output() callback: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private ngRedux: NgRedux<IRootState>
  ) { }

  ngOnInit() {
    const that = this;
    $('#modal').modal({
      backdrop: 'static',
      show: true,
      focus: false
    });
    $('#modal').on('hidden.bs.modal', function() {
      that.ngRedux.dispatch({
        type: MODAL_OPEN,
        payload: ''
      });
    });
  }
  onClose() {
    if (!this.callback.observers.length) {
      $('#modal').modal('hide');
    } else {
      this.callback.emit('hide');
    }
  }
  ngOnDestroy() {
    $('#modal').modal('hide');
  }


}
