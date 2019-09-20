import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../../../core/services/navigation.service';
import { Request } from '../../../model/request.class';
import { Position } from '../../../model/position.class';
import { Skill } from '../../../model/skill.class';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/switchMap';
import { Subscription } from 'rxjs/Subscription';
import { PositionService } from '../../../admin/config/position/services/position.service';
import { SkillService } from '../../../admin/config/skill/services/skill.service';
import { GetAllService } from '../../../core/services/get-all.service';
import { Experience } from '../../../model/experience.class';
import { Project } from '../../../model/project.class';
import { RecruitmentType } from '../../../model/recruitment-type.class';
import { ForeignLanguage } from '../../../model/foreign-language.class';
import { Priority } from '../../../model/priority.class';
import Utils from '../../../shared/helpers/util';
import { User } from '../../../model/user.class';
import { IdentityService } from '../../../core/services/identity.service';
import { validateDeadline } from '../../../shared/custom-validator/deadline.validator';
import { RequestManagementService } from '../../services/request-management.service';

declare var $: any;
@Component({
  selector: 'app-request-management-detail-du-lead',
  templateUrl: './request-management-detail-du-lead.component.html',
  styleUrls: ['./request-management-detail-du-lead.component.css']
})
export class RequestManagementDetailDuLeadComponent implements OnInit, OnDestroy {
  currentUser: User;
  request: Request;
  allPositions;
  allSkills;
  allProjects;
  allExperiences;
  allForeignLanguages;
  allRecruitmentTypes;
  allPrioritys;
  subscriptionRequest: Subscription;
  subscriptionPosition: Subscription;
  subscriptionSkill: Subscription;
  subscriptionForeignLanguage: Subscription;
  subscriptionProject: Subscription;
  subscriptionRecruitmentType: Subscription;
  subscriptionExperience: Subscription;
  subscriptionPriority: Subscription;
  skillIds = [];
  foreignLanguageIds = [];
  isUpdateSuccess = false;
  isSubmitted = false;
  form: FormGroup;

  constraints = {
    title: {
      minLength: 1,
      maxLength: 255
    },
    number: {
      min: 1,
      max: 1000
    },
    description: {
      minLength: 1,
      maxLength: 3000
    },
    certificate: {
      maxLength: 255
    },
    major: {
      maxLength: 255
    },
    salary: {
      maxLength: 255
    },
    others: {
      maxLength: 3000
    },
    benefit: {
      maxLength: 3000
    }
  };
  
  // skillsIsTouched = false;

  setDataForViewInit() {
    this.getIdsToDisplayWhenViewAppear();
    this.title.setValue(this.request.title);
    if (this.isCanUpdate()) {
      this.position.setValue(this.request.positionId.id);
      this.deadline.setValue(Utils.convertToNgbDatepickerFormat(this.request.deadline));
      this.project.setValue(this.request.projectId.id);
      this.recruitmentType.setValue(this.request.recruitmentTypeId.id);
      this.priority.setValue(this.request.priorityId.id);
      this.experience.setValue(this.request.experienceId.id);
    } else {
      this.position.setValue(this.request.positionId.title);
      this.deadline.setValue(this.request.deadline);
      this.project.setValue(this.request.projectId.title);
      this.recruitmentType.setValue(this.request.recruitmentTypeId.title);
      this.priority.setValue(this.request.priorityId.title);
      this.experience.setValue(this.request.experienceId.title);
    }
    this.number.setValue(this.request.number);
    this.description.setValue(this.request.description);
    this.certificate.setValue(this.request.certificate);
    this.major.setValue(this.request.major);
    this.others.setValue(this.request.others);
    this.salary.setValue(this.request.salary);
    this.benefit.setValue(this.request.benefit);
  }

  ngOnInit() {
    this.currentUser = this.identityService.getCurrentUser();
    this.buildForm();
    this.subscriptionGetOneRequest();
    this.subscriptionGetAllDataForSelectBox();
  }

  // ngAfterViewChecked() {
  //   const that = this;
  //   $('#skills').on('select2:close', function() {
  //     that.skillsIsTouched = true;
  //     console.log(that.skillsIsTouched);
  //   });
  // }

  ngOnDestroy() {
    if (this.subscriptionPosition)
      this.subscriptionPosition.unsubscribe();
    if (this.subscriptionSkill)
      this.subscriptionSkill.unsubscribe();
    if (this.subscriptionRequest)
      this.subscriptionRequest.unsubscribe();
    if (this.subscriptionExperience)
      this.subscriptionExperience.unsubscribe();
    if (this.subscriptionForeignLanguage)
      this.subscriptionForeignLanguage.unsubscribe();
    if (this.subscriptionProject)
      this.subscriptionProject.unsubscribe();
    if (this.subscriptionRecruitmentType)
      this.subscriptionRecruitmentType.unsubscribe();
    if (this.subscriptionPriority)
      this.subscriptionPriority.unsubscribe();
  }

  updateRequestReceived() {
    let deadline = this.deadline.value;
    this.request.title = this.title.value;
    this.request.positionId = new Position(parseInt(this.position.value));
    this.request.number = parseInt(this.number.value);
    this.request.deadline = (this.deadline.value == null) ? null : Utils.dateToString(Utils.createDate(deadline.year, deadline.month, deadline.day));
    this.request.projectId = new Project(parseInt(this.project.value));
    this.request.recruitmentTypeId = new RecruitmentType(parseInt(this.recruitmentType.value));
    this.request.priorityId = new Priority(parseInt(this.priority.value));
    // this.request.skillCollection = new Array<Skill>();
    // for (let item of $('#skills').val()) {
    //   this.request.skillCollection.push(new Skill(parseInt(Utils.getValueFromString(item))));
    // }
    const skillIdCollection = this.skills.value || [];
    this.request.skillCollection = [];
    if (skillIdCollection.length > 0) {
      for (const skillId of skillIdCollection) {
        this.request.skillCollection.push(new Skill(skillId));
      }
    }
    this.request.experienceId = new Experience(parseInt(this.experience.value));
    this.request.description = this.description.value;
    // this.request.foreignLanguageCollection = new Array<ForeignLanguage>();
    // for (let item of $('#foreignLanguage').val()) {
    //   this.request.foreignLanguageCollection.push(new ForeignLanguage(parseInt(Utils.getValueFromString(item))));
    // }
    const foreignLanguageIdCollection = this.foreignLanguage.value || [];
    this.request.foreignLanguageCollection = [];
    if (foreignLanguageIdCollection.length > 0) {
      for (const foreignLanguageId of foreignLanguageIdCollection) {
        this.request.foreignLanguageCollection.push(new ForeignLanguage(foreignLanguageId));
      }
    }
    this.request.certificate = (this.certificate.value == null) ? "" : this.certificate.value;
    this.request.major = (this.major.value == null) ? "" : this.major.value;
    this.request.others = (this.others.value == null) ? "" : this.others.value;
    this.request.salary = (this.salary.value == null) ? "" : this.salary.value;
    this.request.benefit = (this.benefit.value == null) ? "" : this.benefit.value;
  }

  // formIsValid() {
  //   return (this.title.valid && this.position.valid && this.number.valid && this.deadline.valid
  //     && this.project.valid && this.recruitmentType.valid && this.priority.valid && this.description.valid
  //     && this.experience.valid && $('#skills').val().length > 0) ? true : false;
  // }

  isCanUpdate() {
    if (this.request) {
      return (
        (this.request.requestStatusId.title == "Rejected" || this.request.requestStatusId.title == "New") &&
        (this.request.createdBy.departmentId.id === this.currentUser.departmentId.id)
      ) ? true : false;
    }
    return null;
  }

  onUpdate() {
    this.isSubmitted = true;
    this.isUpdateSuccess = false;
    this.updateRequestReceived();
    if (this.form.valid) {
      this.requestManagementService.update(this.request).subscribe((res: any) => {
        if (res.responseCode === "SUCCESS") {
          this.isUpdateSuccess = true;
          window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
        }
      }, err => {
        console.log(err);
      });
    }
  }

  onReset() {
    this.isSubmitted = false;
    this.isUpdateSuccess = false;
    // this.skillsIsTouched = false;
    this.form.reset();
    // $('#skills').select2({ data: [], placeholder: "Select skills", maximumSelectionLength: 5 }).trigger("change");
    // $('#foreignLanguage').select2({ data: [], placeholder: "Select foreign languages", maximumSelectionLength: 5 }).trigger("change");
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
  }

  onClone() {
    this.requestManagementService.request = this.request;
    this.navigationService.navRequestCreate();
  }

  // skillsFieldIsValid() {
  //   return ($('#skills').val() == null || $('#skills').val().length === 0) ? false : true;
  // }

  constructor(
    private requestManagementService: RequestManagementService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private navigationService: NavigationService,
    private getAllService: GetAllService,
    private identityService: IdentityService
  ) {}

  buildForm() {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      position: new FormControl(null, Validators.required),
      skills: new FormControl(null, [
        Validators.required
      ]),
      priority: new FormControl(null, Validators.required),
      experience: new FormControl(null, Validators.required),
      project: new FormControl(null, Validators.required),
      recruitmentType: new FormControl(null, Validators.required),
      deadline: new FormControl(null, [
        Validators.required,
        validateDeadline
      ]),
      number: new FormControl(null, [
        Validators.required,
        Validators.min(1)
      ]),
      description: new FormControl(null, [
        Validators.required
      ]),
      certificate: new FormControl(null),
      major: new FormControl(null),
      others: new FormControl(null),
      salary: new FormControl(null),
      benefit: new FormControl(null),
      foreignLanguage: new FormControl(null)
    });
  }

  numberChange(value) {
    // if (value < this.constraints.number.min) {
    //   this.form.get("number").setValue(this.constraints.number.min);
    // } else 
    if (value > this.constraints.number.max) {
      this.form.get("number").setValue(this.constraints.number.max);
    }
  }

  getIdsToDisplayWhenViewAppear() {
    // this._script.load('app-request-detail-du-lead',
    //   'assets/demo/default/custom/components/forms/widgets/my-select2.js');
    this.skillIds = [];
    this.foreignLanguageIds = [];
    for (let item of this.request.skillCollection) {
      this.skillIds.push(item.id);
    }
    this.skills.setValue(this.skillIds);
    for (let item of this.request.foreignLanguageCollection) {
      this.foreignLanguageIds.push(item.id);
    }
    this.foreignLanguage.setValue(this.foreignLanguageIds);
  }

  subscriptionGetOneRequest() {
    this.subscriptionRequest = Observable.combineLatest([this.activatedRoute.paramMap])
      .switchMap(combined => {
        let id = 0;
        try {
          id = parseInt(combined[0].get('id'), 10);
        } catch (err) {
          id = 0;
        }
        return this.requestManagementService.getOne(+id);
      })
      .subscribe(res => {
        this.request = res;
        this.setDataForViewInit();
        console.log(this.request);
      }, err => console.log(err));
  }

  subscriptionGetAllDataForSelectBox() {
    this.subscriptionPosition = this.getAllService.getAllPositions().subscribe((positions: Position[]) => {
      this.allPositions = positions;
    }, err => console.log('>>>> get positions error: ', err));
    this.subscriptionSkill = this.getAllService.getAllSkills().subscribe((skills: Skill[]) => {
      this.allSkills = skills;
    }, err => console.log('>>>> get skills error: ', err));
    this.subscriptionExperience = this.getAllService.getAllExperiences().subscribe((experiences: Experience[]) => {
      this.allExperiences = experiences;
    }, err => console.log('>>>> get experiences error: ', err));
    this.subscriptionProject = this.getAllService.getAllProjects().subscribe((projects: Project[]) => {
      this.allProjects = projects;
    }, err => console.log('>>>> get projects error: ', err));
    this.subscriptionRecruitmentType = this.getAllService.getAllRecruitmentTypes().subscribe((recruitmentTypes: RecruitmentType[]) => {
      this.allRecruitmentTypes = recruitmentTypes;
    }, err => console.log('>>>> get recruitment types error: ', err));
    this.subscriptionForeignLanguage = this.getAllService.getAllForeignLanguages().subscribe((foreignLanguages: ForeignLanguage[]) => {
      this.allForeignLanguages = foreignLanguages;
    }, err => console.log('>>>> get foreign languages error: ', err));
    this.subscriptionPriority = this.getAllService.getAllPrioritys().subscribe((prioritys: Priority[]) => {
      this.allPrioritys = prioritys;
    }, err => console.log('>>>> get prioritys error: ', err));
  }

  navRequestList() {
    this.navigationService.navRequestList();
  }

  navRequestCreate() {
    this.requestManagementService.request = null;
    this.navigationService.navRequestCreate();
  }
  onCancel() {
    this.navRequestList();
  }  

  get foreignLanguage() {
    return this.form.get('foreignLanguage');
  }
  get recruitmentType() {
    return this.form.get('recruitmentType');
  }
  get project() {
    return this.form.get('project');
  }
  get title() {
    return this.form.get('title');
  }
  get position() {
    return this.form.get('position');
  }
  get deadline() {
    return this.form.get('deadline');
  }
  get number() {
    return this.form.get('number');
  }
  get skills() {
    return this.form.get('skills');
  }
  get description() {
    return this.form.get('description');
  }
  get priority() {
    return this.form.get('priority');
  }
  get experience() {
    return this.form.get('experience');
  }
  get certificate() {
    return this.form.get('certificate');
  }
  get major() {
    return this.form.get('major');
  }
  get others() {
    return this.form.get('others');
  }
  get salary() {
    return this.form.get('salary');
  }
  get benefit() {
    return this.form.get('benefit');
  }
}
