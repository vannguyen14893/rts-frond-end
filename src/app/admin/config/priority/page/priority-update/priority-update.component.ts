import { CommonValidator } from '../../../../../shared/custom-validator/common.validator';
import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Priority } from '../../../../../model/priority.class';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PriorityService } from '../../service/priority.service';
import { NavigationService } from '../../../../../core/services/navigation.service';
import { Subscription } from 'rxjs/Subscription';
import { PriorityValidator } from '../../../../../shared/custom-validator/priority.validator';

@Component({
  selector: 'app-priority-update',
  templateUrl: './priority-update.component.html',
  styleUrls: ['./priority-update.component.css']
})
export class PriorityUpdateComponent implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    if (this.subPriority)
      return this.subPriority.unsubscribe();
  }
  @Output() submitted = new EventEmitter<string>();

  @Input() oldPriority: Priority;

  formPriority: FormGroup;
  priority: Priority;

  subPriority: Subscription;
  constructor(
    private fb: FormBuilder,
    public priorityService: PriorityService,
    private navigationService: NavigationService,
  ) {
    this.formPriority = fb.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255), CommonValidator.notEmpty]],
      description: ['', [Validators.maxLength(255)]],
    });
  }

  ngOnInit() {
  }

  validateTitle() {
    const oldTitle = this.oldPriority.title;
    if (this.title.value.trim() !== '') {
      this.priorityService.findByTitle({ title: this.title.value.trim() })
        .subscribe(response => {
          if (response && response.title != oldTitle)
            this.title.setErrors({ shouldBeUnique: true });
        }, error => {
          console.log(error)
        });
    }
  }
  onSubmit() {
    if (this.formPriority.valid) {
      const priority = {
        id: this.oldPriority.id,
        title: this.title.value.trim(),
        description: this.description.value.trim()
      }
      this.subPriority = this.priorityService.createOrUpdate(priority)
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
    return this.formPriority.get('title');
  }

  get description() {
    return this.formPriority.get('description');
  }
}
