import { OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { CandidateStatus } from '../../../../../model/candidate-status.class';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { CandidateStatusService } from '../../service/candidate-status.service';
import { NavigationService } from '../../../../../core/services/navigation.service';
import { CommonValidator } from '../../../../../shared/custom-validator/common.validator';

@Component({
  selector: 'app-candidate-status-update',
  templateUrl: './candidate-status-update.component.html',
  styleUrls: ['./candidate-status-update.component.css']
})
export class CandidateStatusUpdateComponent implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    if (this.subCandidateStatus)
      this.subCandidateStatus.unsubscribe();
  }
  // To inform parent when the candidateStatus is created successfully.
  @Output() submitted = new EventEmitter<string>();

  @Input() oldCandidateStatus: CandidateStatus;

  formCandidateStatus: FormGroup;

  private subCandidateStatus: Subscription;
  constructor(
    private fb: FormBuilder,
    public candidateStatusService: CandidateStatusService,
    private navigationService: NavigationService,
  ) {
    this.formCandidateStatus = fb.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255), CommonValidator.notEmpty]],
      description: ['', [Validators.maxLength(255)]],
    });
  }

  ngOnInit() {
  }

  validateTitle() {
    const oldTitle = this.oldCandidateStatus.title;
    if (this.title.value.trim() !== '') {
      this.candidateStatusService.findByTitle({ title: this.title.value.trim() })
        .subscribe((candidateStatus: CandidateStatus) => {
          if (candidateStatus && candidateStatus.title != oldTitle)
            this.title.setErrors({ shouldBeUnique: true });
        }, error => {
          console.log(error)
        });
    }
  }
  onSubmit() {
    if (this.formCandidateStatus.valid) {
      const departmemt = {
        id: this.oldCandidateStatus.id,
        title: this.title.value.trim(),
        description: this.description.value.trim()
      }
      this.candidateStatusService.createOrUpdate(departmemt)
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
    return this.formCandidateStatus.get('title');
  }

  get description() {
    return this.formCandidateStatus.get('description');
  }

}
