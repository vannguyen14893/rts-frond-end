import { CommonValidator } from '../../../../../shared/custom-validator/common.validator';
import { OnDestroy } from '@angular/core';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavigationService } from '../../../../../core/services/navigation.service';
import { PriorityService } from '../../service/priority.service';
import { PriorityValidator } from '../../../../../shared/custom-validator/priority.validator';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-priority-create',
  templateUrl: './priority-create.component.html',
  styleUrls: ['./priority-create.component.css']
})
export class PriorityCreateComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    if (this.subPriority)
      this.subPriority.unsubscribe();
  }
  @Output() submitted = new EventEmitter<string>();

  formPriority: FormGroup;
  private subPriority: Subscription;
  constructor(
    private fb: FormBuilder,
    private priorityService: PriorityService,
    private navigationService: NavigationService,
  ) {
    this.formPriority = fb.group({
      title: ['', [Validators.required, Validators.maxLength(255), CommonValidator.notEmpty], PriorityValidator.shouldBeUnique(this.priorityService)],
      description: ['', [Validators.maxLength(255)]],
    });
  }

  ngOnInit() {

  }

  onCancel() {
    this.resetForm ();
  }

  resetForm () {
    this.formPriority.reset();
    this.formPriority = this.fb.group({
      title: ['', [Validators.required, CommonValidator.notEmpty], PriorityValidator.shouldBeUnique(this.priorityService)],
      description: ['', [Validators.maxLength(255)]],
    });
  }
  onSubmit() {
    if (this.formPriority.valid) {
      const priority = {
        title: this.title.value.trim(),
        description: this.description.value.trim()
      }
      this.subPriority = this.priorityService.createOrUpdate(priority)
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
    return this.formPriority.get('title');
  }

  get description() {
    return this.formPriority.get('description');
  }
}
