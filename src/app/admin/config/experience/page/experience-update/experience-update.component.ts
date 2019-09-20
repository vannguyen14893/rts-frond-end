import { CommonValidator } from '../../../../../shared/custom-validator/common.validator';
import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Experience } from '../../../../../model/experience.class';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ExperienceService } from '../../service/experience.service';
import { NavigationService } from '../../../../../core/services/navigation.service';
import { ExperienceValidator } from '../../../../../shared/custom-validator/experience.validator';

@Component({
  selector: 'app-experience-update',
  templateUrl: './experience-update.component.html',
  styleUrls: ['./experience-update.component.css']
})
export class ExperienceUpdateComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    if (this.subExperience)
      return this.subExperience.unsubscribe();
  }
  @Output() submitted = new EventEmitter<string>();

  @Input() oldExperience: Experience;

  formExperience: FormGroup;
  experience: Experience;

  subExperience: Subscription;
  constructor(
    private fb: FormBuilder,
    public experienceService: ExperienceService,
    private navigationService: NavigationService,
  ) {
    this.formExperience = fb.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255), CommonValidator.notEmpty]],
      description: ['', [Validators.maxLength(255)]],
    });
  }

  ngOnInit() {
  }

  validateTitle() {
    const oldTitle = this.oldExperience.title;
    if (this.title.value.trim() !== '') {
      this.experienceService.findByTitle({ title: this.title.value.trim() })
        .subscribe(response => {
          if (response && response.title != oldTitle)
            this.title.setErrors({ shouldBeUnique: true });
        }, error => {
          console.log(error)
        });
    }
  }
  onSubmit() {
    if (this.formExperience.valid) {
      const experience = {
        id: this.oldExperience.id,
        title: this.title.value.trim(),
        description: this.description.value.trim()
      }
      this.subExperience = this.experienceService.createOrUpdate(experience)
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
    return this.formExperience.get('title');
  }

  get description() {
    return this.formExperience.get('description');
  }

}
