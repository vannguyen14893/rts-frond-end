import { CommonValidator } from '../../../../../shared/custom-validator/common.validator';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { CertificationService } from '../../services/certification.service';
import { CertificationValidator } from '../../../../../shared/custom-validator/certification.validator';
import { NavigationService } from '../../../../../core/services/navigation.service';

@Component({
  selector: 'app-certification-create',
  templateUrl: './certification-create.component.html',
  styleUrls: ['./certification-create.component.css']
})
export class CertificationCreateComponent implements OnInit {
  @Output() submitted = new EventEmitter<string>();

  formCertification: FormGroup;

  subCertification: Subscription;
  constructor(
    private fb: FormBuilder,
    private certificationService: CertificationService,
    private navigationService: NavigationService,
  ) {
    this.formCertification = fb.group({
      title: ['', [Validators.required, Validators.maxLength(255), CommonValidator.notEmpty], CertificationValidator.shouldBeUnique(this.certificationService)],
      description: [ '', [Validators.maxLength(255)]],
    });
   }

  ngOnInit() {
  }

  onCancel() {
    this.resetForm ();
  }

  resetForm () {
    this.formCertification.reset();
    this.formCertification = this.fb.group({
      title: ['', [Validators.required, CommonValidator.notEmpty], CertificationValidator.shouldBeUnique(this.certificationService)],
      description: ['', [Validators.maxLength(255)]],
    });
  }

  onSubmit() {
    if (this.formCertification.valid) {
      const certification = {
        title: this.title.value.trim(),
        description: this.description.value.trim()
      }
      this.subCertification = this.certificationService.createOrUpdate(certification)
        .subscribe(response => {
          if(response.title === this.title.value) {
            this.submitted.emit('success');
            this.resetForm();
          }
        }, error => {
          this.submitted.emit('fail');
        });
    }
  }
  get title() {
    return this.formCertification.get('title');
  }

  get description() {
    return this.formCertification.get('description');
  }

}
