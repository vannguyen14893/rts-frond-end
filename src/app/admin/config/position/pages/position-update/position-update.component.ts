import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Subscription";
import { PositionService } from "../../services/position.service";
import { NavigationService } from "../../../../../core/services/navigation.service";
import { CommonValidator } from "../../../../../shared/custom-validator/common.validator";
import { Position } from "../../../../../model/position.class";

@Component({
  selector: 'app-position-update',
  templateUrl: './position-update.component.html',
  styleUrls: ['./position-update.component.css']
})
export class PositionUpdateComponent implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    if (this.subPosition)
      this.subPosition.unsubscribe();
  }
  // To inform parent when the position is created successfully.
  @Output() submitted = new EventEmitter<string>();

  @Input() oldPosition: Position;

  formPosition: FormGroup;

  private subPosition: Subscription;

  constructor(
    private fb: FormBuilder,
    public positionService: PositionService,
    private navigationService: NavigationService,
  ) {
    this.formPosition = fb.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255), CommonValidator.notEmpty]],
      description: ['', [Validators.maxLength(255)]],
    });
  }

  ngOnInit() {
  }

  validateTitle() {
    const oldTitle = this.oldPosition.title;
    if (this.title.value.trim() !== '') {
      this.positionService.findByTitle({ title: this.title.value.trim() })
        .subscribe((position: Position) => {
          if (position && position.title != oldTitle)
            this.title.setErrors({ shouldBeUnique: true });
        }, error => {
          console.log(error)
        });
    }
  }
  onSubmit() {
    if (this.formPosition.valid) {
      const departmemt = {
        id: this.oldPosition.id,
        title: this.title.value.trim(),
        description: this.description.value.trim()
      }
      this.positionService.createOrUpdate(departmemt)
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
    return this.formPosition.get('title');
  }

  get description() {
    return this.formPosition.get('description');
  }

}
