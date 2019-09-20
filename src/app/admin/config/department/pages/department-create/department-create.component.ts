import { OnDestroy } from '@angular/core';
import { CommonValidator } from '../../../../../shared/custom-validator/common.validator';
import { NavigationService } from '../../../../../core/services/navigation.service';
import { DepartmentValidator } from '../../../../../shared/custom-validator/department.validator';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DepartmentService } from '../../service/department.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-department-create',
  templateUrl: './department-create.component.html',
  styleUrls: ['./department-create.component.css']
})
export class DepartmentCreateComponent implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    if (this.subDepartment)
      this.subDepartment.unsubscribe();
  }
  // To inform parent when the department is created successfully.
  @Output() submitted = new EventEmitter<string>();

  formDepartment: FormGroup;

  private subDepartment: Subscription;
  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private navigationService: NavigationService,
  ) {
    this.formDepartment = fb.group({
      title: ['', [Validators.required, CommonValidator.notEmpty, Validators.maxLength(255)], DepartmentValidator.shouldBeUnique(this.departmentService)],
      description: [ '', [Validators.maxLength(255)]],
    });
  }

  ngOnInit() {

  }

  onCancel() {
    this.resetForm ();
  }

  resetForm () {
    this.formDepartment.reset();
    this.formDepartment = this.fb.group({
      title: ['', [Validators.required, CommonValidator.notEmpty], DepartmentValidator.shouldBeUnique(this.departmentService)],
      description: ['', [Validators.maxLength(255)]],
    });
  }
  onSubmit() {
    if (this.formDepartment.valid) {
      const departmemt = {
        title: this.title.value.trim(),
        description: this.description.value.trim()
      };
      this.subDepartment = this.departmentService.createOrUpdate(departmemt)
        .subscribe(response => {
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
    return this.formDepartment.get('title');
  }

  get description() {
    return this.formDepartment.get('description');
  }
}
