import { CommonValidator } from '../../../../../shared/custom-validator/common.validator';
import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Certification } from '../../../../../model/certification.class';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { CertificationService } from '../../services/certification.service';
import { NavigationService } from '../../../../../core/services/navigation.service';
import { CertificationValidator } from '../../../../../shared/custom-validator/certification.validator';

@Component({
  selector: 'app-certification-update',
  templateUrl: './certification-update.component.html',
  styleUrls: ['./certification-update.component.css']
})
export class CertificationUpdateComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    if (this.subCertification)
      return this.subCertification.unsubscribe();
  }
  @Output() submitted = new EventEmitter<string>();

  @Input() oldCertification: Certification;

  formCertification: FormGroup;
  certification: Certification;

  subCertification: Subscription;
  constructor(
    private fb: FormBuilder,
    public certificationService: CertificationService,
    private navigationService: NavigationService,
  ) {
    this.formCertification = fb.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255), CommonValidator.notEmpty]],
      description: ['', [Validators.maxLength(255)]],
    });
  }

  ngOnInit() {
  }

  validateTitle() {
    const oldTitle = this.oldCertification.title;
    if (this.title.value.trim() !== '') {
      this.certificationService.findByTitle({ title: this.title.value.trim() })
        .subscribe(response => {
          if (response && response.title != oldTitle)
            this.title.setErrors({ shouldBeUnique: true });
        }, error => {
          console.log(error)
        });
    }
  }
  onSubmit() {
    if (this.formCertification.valid) {
      const certification = {
        id: this.oldCertification.id,
        title: this.title.value.trim(),
        description: this.description.value.trim()
      }
      this.subCertification = this.certificationService.createOrUpdate(certification)
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
    return this.formCertification.get('title');
  }

  get description() {
    return this.formCertification.get('description');
  }

}
