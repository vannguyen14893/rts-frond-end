import { OnDestroy } from '@angular/core';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RequestStatusService } from '../../service/request-status.service';
import { NavigationService } from '../../../../../core/services/navigation.service';
import { Subscription } from 'rxjs/Subscription';
import { CommonValidator } from '../../../../../shared/custom-validator/common.validator';
import { RequestStatusValidator } from '../../../../../shared/custom-validator/request-status.validator';

@Component({
  selector: 'app-request-status-create',
  templateUrl: './request-status-create.component.html',
  styleUrls: ['./request-status-create.component.css']
})
export class RequestStatusCreateComponent implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    if (this.subRequestStatus)
      this.subRequestStatus.unsubscribe();
  }
  // To inform parent when the requestStatus is created successfully.
  @Output() submitted = new EventEmitter<string>();

  private subRequestStatus: Subscription;

  formRequestStatus: FormGroup;
  constructor(
    private fb: FormBuilder,
    private requestStatusService: RequestStatusService,
    private navigationService: NavigationService,
  ) {
    this.formRequestStatus = fb.group({
      title: ['', [Validators.required, CommonValidator.notEmpty, Validators.maxLength(255)], RequestStatusValidator.shouldBeUnique(this.requestStatusService)],
      description: ['', [Validators.maxLength(255)]],
    });
  }

  ngOnInit() {
  }

  onCancel() {
    this.formRequestStatus.reset();
  }

  onSubmit() {
    if (this.formRequestStatus.valid) {
      const departmemt = {
        title: this.title.value.trim(),
        description: this.description.value.trim()
      }
      this.subRequestStatus = this.requestStatusService.createOrUpdate(departmemt)
        .subscribe(response => {
          if (response.title === this.title.value.trim()) {
            this.submitted.emit('success');
            this.formRequestStatus.reset();
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
