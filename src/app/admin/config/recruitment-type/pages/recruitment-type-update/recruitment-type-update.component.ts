import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from "@angular/core";
import { RecruitmentType } from "../../../../../model/recruitment-type.class";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Subscription";
import { RecruitmentTypeService } from "../../service/recruitment-type.service";
import { NavigationService } from "../../../../../core/services/navigation.service";
import { CommonValidator } from "../../../../../shared/custom-validator/common.validator";

@Component({
  selector: 'app-recruitment-type-update',
  templateUrl: './recruitment-type-update.component.html',
  styleUrls: ['./recruitment-type-update.component.css']
})
export class RecruitmentTypeUpdateComponent implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    if (this.subRecruitmentType)
      this.subRecruitmentType.unsubscribe();
  }
  // To inform parent when the recruitmentType is created successfully.
  @Output() submitted = new EventEmitter<string>();

  @Input() oldRecruitmentType: RecruitmentType;

  formRecruitmentType: FormGroup;

  private subRecruitmentType: Subscription;
  constructor(
    private fb: FormBuilder,
    public recruitmentTypeService: RecruitmentTypeService,
    private navigationService: NavigationService,
  ) {
    this.formRecruitmentType = fb.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255), CommonValidator.notEmpty]],
      description: ['', [Validators.maxLength(255)]],
    });
  }

  ngOnInit() {
  }

  validateTitle() {
    const oldTitle = this.oldRecruitmentType.title;
    if (this.title.value.trim() !== '') {
      this.recruitmentTypeService.findByTitle({ title: this.title.value.trim() })
        .subscribe((recruitmentType: RecruitmentType) => {
          if (recruitmentType && recruitmentType.title != oldTitle)
            this.title.setErrors({ shouldBeUnique: true });
        }, error => {
          console.log(error)
        });
    }
  }
  onSubmit() {
    if (this.formRecruitmentType.valid) {
      const departmemt = {
        id: this.oldRecruitmentType.id,
        title: this.title.value.trim(),
        description: this.description.value.trim()
      }
      this.recruitmentTypeService.createOrUpdate(departmemt)
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
    return this.formRecruitmentType.get('title');
  }

  get description() {
    return this.formRecruitmentType.get('description');
  }
}
