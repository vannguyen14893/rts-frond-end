import { CommonValidator } from '../../../../../shared/custom-validator/common.validator';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NavigationService } from '../../../../../core/services/navigation.service';
import { SkillService } from '../../services/skill.service';
import { SkillValidator } from '../../../../../shared/custom-validator/skill.validator';

@Component({
  selector: 'app-skill-create',
  templateUrl: './skill-create.component.html',
  styleUrls: ['./skill-create.component.css']
})
export class SkillCreateComponent implements OnInit {
  // To inform parent when the department is created successfully.
  @Output() submitted = new EventEmitter<string>();

  formSkill: FormGroup;
  constructor(
    private fb: FormBuilder,
    private skillService: SkillService,
    private navigationService: NavigationService,
  ) {
    this.formSkill = fb.group({
      title: ['', [Validators.required, CommonValidator.notEmpty], SkillValidator.shouldBeUnique(this.skillService)],
      description: ['', [Validators.maxLength(255)]],
    });
  }

  ngOnInit() {

  }

  onCancel() {
    this.resetForm ();
  }

  resetForm () {
    this.formSkill.reset();
    this.formSkill = this.fb.group({
      title: ['', [Validators.required, CommonValidator.notEmpty], SkillValidator.shouldBeUnique(this.skillService)],
      description: ['', [Validators.maxLength(255)]],
    });
  }
  onSubmit() {
    if (this.formSkill.valid) {
      const skill = {
        title: this.title.value.trim(),
        description: this.description.value.trim()
      };
      this.skillService.createOrUpdate(skill)
        .subscribe(response => {
          if (response.title === this.title.value.trim()) {
            this.submitted.emit('success');
            this.resetForm();
          }
        }, error => {
          this.submitted.emit('fail');
        });
    }
  }
  get title() {
    return this.formSkill.get('title');
  }

  get description() {
    return this.formSkill.get('description');
  }

}
