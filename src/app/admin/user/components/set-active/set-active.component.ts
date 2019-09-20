import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs/Subscription';
import { IdentityService } from '../../../../core/services/identity.service';

declare var $: any;

@Component({
  selector: 'app-set-active',
  templateUrl: './set-active.component.html',
  styleUrls: ['./set-active.component.css']
})
export class SetActiveComponent implements OnInit, OnDestroy {

  @Input() isActive: boolean;
  @Input() userId: number;
  @Output() submitted = new EventEmitter<string>();
  @Output() cancelModal = new EventEmitter<string>();

  // To check if current user is trying to manipulate himself
  isMyself = false;

  loading = false;

  subChangeStatus: Subscription;

  constructor(
    private userService: UserService,
    private identityService: IdentityService
  ) { }

  ngOnInit() {
    $('#modal_confirm').modal({
      show: true,
      backdrop: 'static'
    });
    this.isMyself = this.userId === this.identityService.getCurrentUser().id;
  }

  closeModal() {
    this.cancelModal.emit('close');
  }

  onConfirm() {
    this.loading = true;
    this.userService.changeStatus(this.userId, this.isActive).subscribe(res => {
      console.log(res);
      this.loading = false;
      this.submitted.emit('success');
    }, err => {
      console.error(err);
      this.submitted.emit('fail');
      this.loading = false;
    });
  }

  ngOnDestroy() {
    $('#modal_confirm').modal('hide');
    if (this.subChangeStatus) {
      this.subChangeStatus.unsubscribe();
    }
  }

}
