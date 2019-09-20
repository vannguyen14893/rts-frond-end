import { Component, OnInit, OnDestroy, Output, EventEmitter } from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { RecruitmentTypeService } from "../../service/recruitment-type.service";
import { NavigationService } from "../../../../../core/services/navigation.service";
import { CommonValidator } from "../../../../../shared/custom-validator/common.validator";
import { RecruitmentTypeValidator } from "../../../../../shared/custom-validator/recruitment-type.validator";

@Component({
  selector: 'app-recruitment-type-create',
  templateUrl: './recruitment-type-create.component.html',
  styleUrls: ['./recruitment-type-create.component.css']
})
export class RecruitmentTypeCreateComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    if (this.subRecruitmentType)
      this.subRecruitmentType.unsubscribe();
  }
  // To inform parent when the recruitmentType is created successfully.
  @Output() submitted = new EventEmitter<string>();

  private subRecruitmentType: Subscription;

  formRecruitmentType: FormGroup;
  constructor(
    private fb: FormBuilder,
    private recruitmentTypeService: RecruitmentTypeService,
    private navigationService: NavigationService,
  ) {
    this.formRecruitmentType = fb.group({
      title: ['', [Validators.required, CommonValidator.notEmpty, Validators.maxLength(255)], RecruitmentTypeValidator.shouldBeUnique(this.recruitmentTypeService)],
      description: ['', [Validators.maxLength(255)]],
    });
  }

  ngOnInit() {
  }

  onCancel() {
    this.resetForm ();
  }

  resetForm () {
    this.formRecruitmentType.reset();
    this.formRecruitmentType = this.fb.group({
      title: ['', [Validators.required, CommonValidator.notEmpty], RecruitmentTypeValidator.shouldBeUnique(this.recruitmentTypeService)],
      description: ['', [Validators.maxLength(255)]],
    });
  }
  
  onSubmit() {
    if (this.formRecruitmentType.valid) {
      const departmemt = {
        title: this.title.value.trim(),
        description: this.description.value.trim()
      }
      this.subRecruitmentType = this.recruitmentTypeService.createOrUpdate(departmemt)
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
    return this.formRecruitmentType.get('title');
  }

  get description() {
    return this.formRecruitmentType.get('description');
  }

}
