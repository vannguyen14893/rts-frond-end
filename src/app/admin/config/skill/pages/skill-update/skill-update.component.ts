import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Skill } from '../../../../../model/skill.class';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SkillService } from '../../services/skill.service';
import { NavigationService } from '../../../../../core/services/navigation.service';
import { SkillValidator } from '../../../../../shared/custom-validator/skill.validator';
import { CommonValidator } from '../../../../../shared/custom-validator/common.validator';

@Component({
  selector: 'app-skill-update',
  templateUrl: './skill-update.component.html',
  styleUrls: ['./skill-update.component.css']
})
export class SkillUpdateComponent implements OnInit {

  // To inform parent when the department is created successfully.
  @Output() submitted = new EventEmitter<string>();

  @Input() oldSkill: Skill;

  formSkill: FormGroup;
  skill: Skill;
  constructor(
    private fb: FormBuilder,
    public skillService: SkillService,
    private navigationService: NavigationService,
  ) {
    this.formSkill = fb.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255), CommonValidator.notEmpty]],
      description: ['', [Validators.maxLength(255)]],
    });
  }

  ngOnInit() {
  }

  validateTitle() {
    const oldTitle = this.oldSkill.title;
    if (this.title.value.trim() !== '') {
      this.skillService.findByTitle({ title: this.title.value.trim() })
        .subscribe((skill: Skill) => {
          if (skill && skill.title != oldTitle)
            this.title.setErrors({ shouldBeUnique: true });
        }, error => {
          console.log(error)
        });
    }
  }
  onSubmit() {
    if (this.formSkill.valid) {
      const skill = {
        id: this.oldSkill.id,
        title: this.title.value.trim(),
        description: this.description.value.trim()
      }
      this.skillService.createOrUpdate(skill)
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
    return this.formSkill.get('title');
  }

  get description() {
    return this.formSkill.get('description');
  }

}
