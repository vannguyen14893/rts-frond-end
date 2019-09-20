import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RequestStatusService } from '../../service/request-status.service';
import { NavigationService } from '../../../../../core/services/navigation.service';
import { RequestStatus } from '../../../../../model/request-status.class';
import { Subscription } from 'rxjs/Subscription';
import { CommonValidator } from '../../../../../shared/custom-validator/common.validator';

@Component({
  selector: 'app-request-status-update',
  templateUrl: './request-status-update.component.html',
  styleUrls: ['./request-status-update.component.css']
})
export class RequestStatusUpdateComponent implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    if (this.subRequestStatus)
      this.subRequestStatus.unsubscribe();
  }
  // To inform parent when the requestStatus is created successfully.
  @Output() submitted = new EventEmitter<string>();

  @Input() oldRequestStatus: RequestStatus;

  formRequestStatus: FormGroup;

  private subRequestStatus: Subscription;
  constructor(
    private fb: FormBuilder,
    public requestStatusService: RequestStatusService,
    private navigationService: NavigationService,
  ) {
    this.formRequestStatus = fb.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255), CommonValidator.notEmpty]],
      description: ['', [Validators.maxLength(255)]],
    });
  }

  ngOnInit() {
  }

  validateTitle() {
    const oldTitle = this.oldRequestStatus.title;
    if (this.title.value.trim() !== '') {
      this.requestStatusService.findByTitle({ title: this.title.value.trim() })
        .subscribe((requestStatus: RequestStatus) => {
          if (requestStatus && requestStatus.title != oldTitle)
            this.title.setErrors({ shouldBeUnique: true });
        }, error => {
          console.log(error)
        });
    }
  }
  onSubmit() {
    if (this.formRequestStatus.valid) {
      const departmemt = {
        id: this.oldRequestStatus.id,
        title: this.title.value.trim(),
        description: this.description.value.trim()
      }
      this.requestStatusService.createOrUpdate(departmemt)
        .subscribe(response => {
          if (response.title === this.title.value.trim()) {
            this.submitted.emit('success');
          }
        }, error => {
          this.submitted.emit('fail');
        });
    }
  }
  get title() {
    return this.formRequestStatus.get('title');
  }

  get description() {
    return this.formRequestStatus.get('description');
  }
}
