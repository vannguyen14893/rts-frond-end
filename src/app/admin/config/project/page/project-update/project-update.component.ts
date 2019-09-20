import { CommonValidator } from '../../../../../shared/custom-validator/common.validator';
import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavigationService } from '../../../../../core/services/navigation.service';
import { Project } from '../../../../../model/project.class';
import { Subscription } from 'rxjs/Subscription';
import { ProjectService } from '../../service/project.service';
import { ProjectValidator } from '../../../../../shared/custom-validator/project.validator';

@Component({
  selector: 'app-project-update',
  templateUrl: './project-update.component.html',
  styleUrls: ['./project-update.component.css']
})
export class ProjectUpdateComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    if (this.subProject)
      return this.subProject.unsubscribe();
  }
  @Output() submitted = new EventEmitter<string>();

  @Input() oldProject: Project;

  formProject: FormGroup;
  project: Project;

  subProject: Subscription;
  constructor(
    private fb: FormBuilder,
    public projectService: ProjectService,
    private navigationService: NavigationService,
  ) {
    this.formProject = fb.group({
      id: [''],
      title: ['', [Validators.required, , CommonValidator.notEmpty, Validators.maxLength(255)]],
      description: ['', [Validators.maxLength(255)]],
    });
  }

  ngOnInit() {
  }

  validateTitle() {
    const oldTitle = this.oldProject.title;
    if (this.title.value.trim() !== '') {
      this.projectService.findByTitle({ title: this.title.value.trim() })
        .subscribe(response => {
          if (response && response.title != oldTitle)
            this.title.setErrors({ shouldBeUnique: true });
        }, error => {
          console.log(error)
        });
    }
  }
  onSubmit() {
    if (this.formProject.valid) {
      const project = {
        id: this.oldProject.id,
        title: this.title.value.trim(),
        description: this.description.value.trim()
      }
      this.subProject = this.projectService.createOrUpdate(project)
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
    return this.formProject.get('title');
  }

  get description() {
    return this.formProject.get('description');
  }
}
