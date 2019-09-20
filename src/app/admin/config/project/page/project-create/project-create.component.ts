import { CommonValidator } from '../../../../../shared/custom-validator/common.validator';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ProjectValidator } from '../../../../../shared/custom-validator/project.validator';
import { ProjectService } from '../../service/project.service';
import { NavigationService } from '../../../../../core/services/navigation.service';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.css']
})
export class ProjectCreateComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    if (this.subProject)
      this.subProject.unsubscribe();
  }
  @Output() submitted = new EventEmitter<string>();

  formProject: FormGroup;
  subProject: Subscription;
  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private navigationService: NavigationService,
  ) {
    this.formProject = fb.group({
      title: ['', [Validators.required, CommonValidator.notEmpty, Validators.maxLength(255)], ProjectValidator.shouldBeUnique(this.projectService)],
      description: [ '', [Validators.maxLength(255)]],
    });
   }

  ngOnInit() {
  }

  onCancel() {
    this.resetForm ();
  }

  resetForm () {
    this.formProject.reset();
    this.formProject = this.fb.group({
      title: ['', [Validators.required, CommonValidator.notEmpty], ProjectValidator.shouldBeUnique(this.projectService)],
      description: ['', [Validators.maxLength(255)]],
    });
  }
  onSubmit() {
    if (this.formProject.valid) {
      const project = {
        title: this.title.value.trim(),
        description: this.description.value.trim()
      }
      this.subProject = this.projectService.createOrUpdate(project)
        .subscribe(response => {
          console.log(response);
          if(response.title === this.title.value.trim()) {
            this.submitted.emit('success');
            this.resetForm();
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
