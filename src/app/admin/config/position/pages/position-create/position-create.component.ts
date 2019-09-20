import { OnDestroy } from '@angular/core';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PositionService } from '../../services/position.service';
import { NavigationService } from '../../../../../core/services/navigation.service';
import { Subscription } from 'rxjs/Subscription';
import { PositionValidator } from '../../../../../shared/custom-validator/position.validator';
import { CommonValidator } from '../../../../../shared/custom-validator/common.validator';

@Component({
  selector: 'app-position-create',
  templateUrl: './position-create.component.html',
  styleUrls: ['./position-create.component.css']
})
export class PositionCreateComponent implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    if (this.subPosition)
      this.subPosition.unsubscribe();
  }
  // To inform parent when the position is created successfully.
  @Output() submitted = new EventEmitter<string>();

  formPosition: FormGroup;

  private subPosition: Subscription;

  constructor(
    private fb: FormBuilder,
    private positionService: PositionService,
    private navigationService: NavigationService,
  ) {
    this.formPosition = fb.group({
      title: ['', [Validators.required, CommonValidator.notEmpty, Validators.maxLength(255)], PositionValidator.shouldBeUnique(this.positionService)],
      description: ['', [Validators.maxLength(255)]],
    });
  }

  ngOnInit() {

  }

  onCancel() {
    this.resetForm ();
  }

  resetForm () {
    this.formPosition.reset();
    this.formPosition = this.fb.group({
      title: ['', [Validators.required, CommonValidator.notEmpty], PositionValidator.shouldBeUnique(this.positionService)],
      description: ['', [Validators.maxLength(255)]],
    });
  }

  onSubmit() {
    if (this.formPosition.valid) {
      const position = {
        title: this.title.value.trim(),
        description: this.description.value.trim()
      }
      this.subPosition = this.positionService.createOrUpdate(position)
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
    return this.formPosition.get('title');
  }

  get description() {
    return this.formPosition.get('description');
  }

  
}
