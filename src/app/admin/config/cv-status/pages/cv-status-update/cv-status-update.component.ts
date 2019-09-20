import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CvStatus } from '../../../../../model/cv-status.class';
import { CvStatusService } from '../../service/cv-status.service';
import { NavigationService } from '../../../../../core/services/navigation.service';
import { CommonValidator } from '../../../../../shared/custom-validator/common.validator';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-cv-status-update',
  templateUrl: './cv-status-update.component.html',
  styleUrls: ['./cv-status-update.component.css']
})
export class CvStatusUpdateComponent implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    if (this.subCvStatus)
      this.subCvStatus.unsubscribe();
  }
  // To inform parent when the cvStatus is created successfully.
  @Output() submitted = new EventEmitter<string>();

  @Input() oldCvStatus: CvStatus;

  formCvStatus: FormGroup;

  private subCvStatus: Subscription;
  constructor(
    private fb: FormBuilder,
    public cvStatusService: CvStatusService,
    private navigationService: NavigationService,
  ) {
    this.formCvStatus = fb.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255), CommonValidator.notEmpty]],
      description: ['', [Validators.maxLength(255)]],
    });
  }

  ngOnInit() {
  }

  validateTitle() {
    const oldTitle = this.oldCvStatus.title;
    if (this.title.value.trim() !== '') {
      this.cvStatusService.findByTitle({ title: this.title.value.trim() })
        .subscribe((cvStatus: CvStatus) => {
          if (cvStatus && cvStatus.title != oldTitle)
            this.title.setErrors({ shouldBeUnique: true });
        }, error => {
          console.log(error)
        });
    }
  }
  onSubmit() {
    if (this.formCvStatus.valid) {
      const departmemt = {
        id: this.oldCvStatus.id,
        title: this.title.value.trim(),
        description: this.description.value.trim()
      }
      this.cvStatusService.createOrUpdate(departmemt)
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
    return this.formCvStatus.get('title');
  }

  get description() {
    return this.formCvStatus.get('description');
  }
}
