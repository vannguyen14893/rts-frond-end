import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core';
import { CommonValidator } from '../../../../../shared/custom-validator/common.validator';
import { Department } from '../../../../../model/department.class';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DepartmentService } from '../../service/department.service';
import { NavigationService } from '../../../../../core/services/navigation.service';
import { DepartmentValidator } from '../../../../../shared/custom-validator/department.validator';

@Component({
  selector: 'app-department-update',
  templateUrl: './department-update.component.html',
  styleUrls: ['./department-update.component.css']
})
export class DepartmentUpdateComponent implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    if (this.subDepartment)
      this.subDepartment.unsubscribe();
  }
  // To inform parent when the department is created successfully.
  @Output() submitted = new EventEmitter<string>();

  @Input() oldDepartment: Department;

  formDepartment: FormGroup;

  private subDepartment: Subscription;

  constructor(
    private fb: FormBuilder,
    public departmentService: DepartmentService,
    private navigationService: NavigationService,
  ) {
    this.formDepartment = fb.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255), CommonValidator.notEmpty]],
      description: ['', [Validators.maxLength(255)]],
    });
  }

  ngOnInit() {
  }

  validateTitle() {
    const oldTitle = this.oldDepartment.title;
    if (this.title.value.trim() !== '') {
      this.departmentService.findByTitle({ title: this.title.value.trim() })
        .subscribe((department: Department) => {
          if (department && department.title != oldTitle)
            this.title.setErrors({ shouldBeUnique: true });
        }, error => {
          console.log(error)
        });
    }
  }
  onSubmit() {
    if (this.formDepartment.valid) {
      const departmemt = {
        id: this.oldDepartment.id,
        title: this.title.value.trim(),
        description: this.description.value.trim()
      }
      this.subDepartment = this.departmentService.createOrUpdate(departmemt)
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
    return this.formDepartment.get('title');
  }

  get description() {
    return this.formDepartment.get('description');
  }

}
