import { ModalMessage } from './../../../model/modal-message.class';
import { EventEmitter, Output, AfterViewInit } from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-modal-message',
  templateUrl: './modal-message.component.html',
  styleUrls: ['./modal-message.component.css']
})
export class ModalMessageComponent implements OnInit, AfterViewInit {

  @Input() message: ModalMessage;
  @Output() modalClosed = new EventEmitter<string>();
  @Input() size: 'm' | 's' | 'l' = 'm';
  @Input() centered: boolean = false;

  contextClass = '';
  sizeClass = '';
  constructor() { }

  ngOnInit() {
    const that = this;
    $('#modal_message').on('hidden.bs.modal', function (e) {
      console.log('closing modal');
      that.modalClosed.emit('closed');
    });
    this.contextClass = this.centered ? this.getContextClass() + ' modal-dialog-centered' : this.getContextClass();
    this.sizeClass = this.getSizeClass();
  }

  ngAfterViewInit() {
    $('#modal_message').modal({
      show: true,
      backdrop: 'static'
    });
  }

  closeModal() {
    $('#modal_message').modal('hide');
  }

  getContextClass = () => {
    console.log('Calling getClass');
    switch (this.message.type) {
      case 'success':
        return 'm-alert m-alert--icon m-alert--outline alert alert-success';
      case 'error':
        return 'm-alert m-alert--icon m-alert--outline alert alert-danger';
      case 'warning':
        return 'm-alert m-alert--icon m-alert--outline alert alert-warning';
      case 'info':
        return 'm-alert m-alert--icon m-alert--outline alert alert-info';
      default:
        return 'm-alert m-alert--icon m-alert--outline alert alert-primary';
    }
  }
  getSizeClass() {
    switch(this.size) {
      case 's':
        return 'modal-dialog-sm'; 
      case 'm':
        return 'modal-dialog'; 
      case 'l':
        return 'modal-dialog modal-lg';
      default:
        return 'modal-dialog';
    }
  }

}
