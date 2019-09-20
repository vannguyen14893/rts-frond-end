import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CandidateStatusService } from '../../service/candidate-status.service';
import { NavigationService } from '../../../../../core/services/navigation.service';
import { CommonValidator } from '../../../../../shared/custom-validator/common.validator';
import { CandidateStatusValidator } from '../../../../../shared/custom-validator/candidate-status.validator';

@Component({
  selector: 'app-candidate-status-create',
  templateUrl: './candidate-status-create.component.html',
  styleUrls: ['./candidate-status-create.component.css']
})
export class CandidateStatusCreateComponent implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    if (this.subCandidateStatus)
      this.subCandidateStatus.unsubscribe();
  }
  // To inform parent when the candidateStatus is created successfully.
  @Output() submitted = new EventEmitter<string>();

  private subCandidateStatus: Subscription;

  formCandidateStatus: FormGroup;
  constructor(
    private fb: FormBuilder,
    private candidateStatusService: CandidateStatusService,
    private navigationService: NavigationService,
  ) {
    this.formCandidateStatus = fb.group({
      title: ['', [Validators.required, CommonValidator.notEmpty, Validators.maxLength(255)], CandidateStatusValidator.shouldBeUnique(this.candidateStatusService)],
      description: ['', [Validators.maxLength(255)]],
    });
  }

  ngOnInit() {
  }

  onCancel() {
    this.formCandidateStatus.reset();
  }
  
  onSubmit() {
    if (this.formCandidateStatus.valid) {
      const departmemt = {
        title: this.title.value.trim(),
        description: this.description.value.trim()
      }
      this.subCandidateStatus = this.candidateStatusService.createOrUpdate(departmemt)
        .subscribe(response => {
          if (response.title === this.title.value.trim()) {
            this.submitted.emit('success');
            this.formCandidateStatus.reset();
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
