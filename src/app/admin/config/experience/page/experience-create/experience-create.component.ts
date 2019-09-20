import { CommonValidator } from '../../../../../shared/custom-validator/common.validator';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ExperienceService } from '../../service/experience.service';
import { ExperienceValidator } from '../../../../../shared/custom-validator/experience.validator';
import { NavigationService } from '../../../../../core/services/navigation.service';

@Component({
  selector: 'app-experience-create',
  templateUrl: './experience-create.component.html',
  styleUrls: ['./experience-create.component.css']
})
export class ExperienceCreateComponent implements OnInit {
  @Output() submitted = new EventEmitter<string>();

  formExperience: FormGroup;

  subExperience: Subscription;
  constructor(
    private fb: FormBuilder,
    private experienceService: ExperienceService,
    private navigationService: NavigationService,
  ) {
    this.formExperience = fb.group({
      title: ['', [Validators.required, Validators.maxLength(255), CommonValidator.notEmpty], ExperienceValidator.shouldBeUnique(this.experienceService)],
      description: [ '', [Validators.maxLength(255)]],
    });
   }

  ngOnInit() {
  }

  onCancel() {
    this.resetForm ();
  }

  resetForm () {
    this.formExperience.reset();
    this.formExperience = this.fb.group({
      title: ['', [Validators.required, CommonValidator.notEmpty], ExperienceValidator.shouldBeUnique(this.experienceService)],
      description: ['', [Validators.maxLength(255)]],
    });
  }

  onSubmit() {
    if (this.formExperience.valid) {
      const experience = {
        title: this.title.value.trim(),
        description: this.description.value.trim()
      }
      this.subExperience = this.experienceService.createOrUpdate(experience)
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
    return this.formExperience.get('title');
  }

  get description() {
    return this.formExperience.get('description');
  }

}
