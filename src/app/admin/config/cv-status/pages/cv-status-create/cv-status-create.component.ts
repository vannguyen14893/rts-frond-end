import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CvStatusService } from '../../service/cv-status.service';
import { NavigationService } from '../../../../../core/services/navigation.service';
import { CommonValidator } from '../../../../../shared/custom-validator/common.validator';
import { CvStatusValidator } from '../../../../../shared/custom-validator/cv-status.validator';

@Component({
  selector: 'app-cv-status-create',
  templateUrl: './cv-status-create.component.html',
  styleUrls: ['./cv-status-create.component.css']
})
export class CvStatusCreateComponent implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    if (this.subCvStatus)
      this.subCvStatus.unsubscribe();
  }
  // To inform parent when the cvStatus is created successfully.
  @Output() submitted = new EventEmitter<string>();

  private subCvStatus: Subscription;

  formCvStatus: FormGroup;
  constructor(
    private fb: FormBuilder,
    private cvStatusService: CvStatusService,
    private navigationService: NavigationService,
  ) {
    this.formCvStatus = fb.group({
      title: ['', [Validators.required, CommonValidator.notEmpty, Validators.maxLength(255)], CvStatusValidator.shouldBeUnique(this.cvStatusService)],
      description: ['', [Validators.maxLength(255)]],
    });
  }

  ngOnInit() {
  }

  onCancel() {
    this.formCvStatus.reset();
  }
  
  onSubmit() {
    if (this.formCvStatus.valid) {
      const departmemt = {
        title: this.title.value.trim(),
        description: this.description.value.trim()
      }
      this.subCvStatus = this.cvStatusService.createOrUpdate(departmemt)
        .subscribe(response => {
          if (response.title === this.title.value.trim()) {
            this.submitted.emit('success');
            this.formCvStatus.reset();
          }
        }, error => {
          this.submitted.emit('fail');
        });
    }
  }
  get title() {
    return this.formCvStatus.get('title');
  }

  get description() {
    return this.formCvStatus.get('description');
  }

}
