import { Request } from './../../../model/request.class';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RequestManagementService } from '../../services/request-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../../../core/services/navigation.service';
import { GetAllService } from '../../../core/services/get-all.service';
import { IdentityService } from '../../../core/services/identity.service';
import Utils from '../../../shared/helpers/util';
import { User } from '../../../model/user.class';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Project } from '../../../model/project.class';
import { Experience } from '../../../model/experience.class';
import { Skill } from '../../../model/skill.class';
import { RecruitmentType } from '../../../model/recruitment-type.class';
import { Position } from '../../../model/position.class';
import { Priority } from '../../../model/priority.class';
import { ForeignLanguage } from '../../../model/foreign-language.class';
import { validateDeadline } from '../../../shared/custom-validator/deadline.validator';
import { Group } from '../../../model/group';
import { Department } from '../../../model/department.class';

declare var $: any;
@Component({
  selector: 'app-request-management-create',
  templateUrl: './request-management-create.component.html',
  styleUrls: ['./request-management-create.component.css']
})
export class RequestManagementCreateComponent implements OnInit, OnDestroy {
  currentUser: User;
  request: Request = null;
  allPositions;
  allSkills;
  allProjects;
  listGroup: Group[];
  listDepartment:  Department[];
  allExperiences;
  allForeignLanguages;
  allRecruitmentTypes;
  allPrioritys;
  subscriptionPosition: Subscription;
  subscriptionDepartment: Subscription;
  subscriptionSkill: Subscription;
  subscriptionForeignLanguage: Subscription;
  subscriptionProject: Subscription;
  subscriptionRecruitmentType: Subscription;
  subscriptionExperience: Subscription;
  subscriptionPriority: Subscription;
  private subListGroup: Subscription;
  skillIds = [];
  foreignLanguageIds = [];
  isCreateSuccess = false;
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

  constructor(
    private requestManagementService: RequestManagementService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private navigationService: NavigationService,
    private getAllService: GetAllService,
    private identityService: IdentityService
  ) {
  }

  // Handle close/refresh the tab
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    return !this.hasUnsavedData();
  }

  ngOnInit() {
    this.currentUser = this.identityService.getCurrentUser();
    this.buildForm();
    this.request = this.requestManagementService.request;
    this.setDataForViewInit();
    this.subscriptionGetAllDataForSelectBox();
    // this.subListGroup = this.getAllService.getAllGroups().subscribe((groups: Group[]) => {
    //   this.listGroup = groups;
    // }, err => console.log( err));
  }

  setDataForViewInit() {
    this.getIdsToDisplayWhenViewAppear();
    if (this.request) {
      this.title.setValue(this.request.title);
      this.position.setValue(this.request.positionId.id);
      this.department.setValue(this.request.departmentId.id);
      this.deadline.setValue(Utils.convertToNgbDatepickerFormat(this.request.deadline));
      this.project.setValue(this.request.projectId.id);
      this.group.setValue(this.request.groupId.id);
      this.recruitmentType.setValue(this.request.recruitmentTypeId.id);
      this.priority.setValue(this.request.priorityId.id);
      this.experience.setValue(this.request.experienceId.id);
      this.number.setValue(this.request.number);
      this.description.setValue(this.request.description);
      this.certificate.setValue(this.request.certificate);
      this.major.setValue(this.request.major);
      this.others.setValue(this.request.others);
      this.salary.setValue(this.request.salary);
      this.benefit.setValue(this.request.benefit);

    } else {
      this.number.setValue(null);
    }
  }

  updateRequestReceived() {
    this.request = new Request();
    const deadline = this.deadline.value;
    this.request.title = this.title.value;
    this.request.positionId = new Position(parseInt(this.position.value, 10));
    this.request.departmentId = new Department(parseInt(this.department.value, 10));
    this.request.number = parseInt(this.number.value, 10);
    this.request.deadline = (this.deadline.value == null) ? null :
      Utils.dateToString(Utils.createDate(deadline.year, deadline.month, deadline.day));
    this.request.groupId = new Group(parseInt(this.group.value, 10));
    this.request.recruitmentTypeId = new RecruitmentType(parseInt(this.recruitmentType.value, 10));
    this.request.priorityId = new Priority(parseInt(this.priority.value, 10));
    let projectNew = new Project();
    projectNew.title = this.project.value;
    this.request.projectId = projectNew;
    const skillIdCollection = this.skills.value || [];
    this.request.skillCollection = [];
    if (skillIdCollection.length > 0) {
      for (const skillTitle of skillIdCollection) {
        let skill = new Skill();
        skill.title = skillTitle;
        this.request.skillCollection.push(skill);
      }
    }
    this.request.experienceId = new Experience(parseInt(this.experience.value, 10));
    this.request.description = this.description.value;
    const foreignLanguageIdCollection = this.foreignLanguage.value || [];
    this.request.foreignLanguageCollection = [];
    if (foreignLanguageIdCollection.length > 0) {
      for (const foreignLanguageId of foreignLanguageIdCollection) {
        this.request.foreignLanguageCollection.push(new ForeignLanguage(foreignLanguageId));
      }
    }
    this.request.certificate = (this.certificate.value == null) ? '' : this.certificate.value;
    this.request.major = (this.major.value == null) ? '' : this.major.value;
    this.request.others = (this.others.value == null) ? '' : this.others.value;
    this.request.salary = (this.salary.value == null) ? '' : this.salary.value;
    this.request.benefit = (this.benefit.value == null) ? '' : this.benefit.value;
  }

  positionSubmitted(event) {
   
  }

  projectSubmitted(event) {
  }

  experienceSubmitted(event) {
  }

  skillSubmitted(event) {
  }

  foreignLanguageSubmitted(event) {
  }

  hasUnsavedData() {
    return !(this.isSubmitted || !this.form.dirty);
  }

  onCreate() {
    this.isCreateSuccess = false;
    this.updateRequestReceived();
    if (this.form.valid) {
      this.requestManagementService.create(this.request).subscribe((res: any) => {
        if (res.responseCode === 'SUCCESS') {
          this.isCreateSuccess = true;
          this.isSubmitted = true;
          this.navigationService.navRequestList();
        }
      }, err => {
        console.log(err);
      });
    }
  }

  onCreateAndContinue() {
    this.isCreateSuccess = false;
    this.updateRequestReceived();
    if (this.form.valid) {
      this.requestManagementService.create(this.request).subscribe((res: any) => {
        if (res.responseCode === 'SUCCESS') {
          this.isCreateSuccess = true;
          window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
        }
        this.form.reset();
      }, err => {
        console.log(err);
      });
    }
  }
  onReset() {
    this.isSubmitted = false;
    this.isCreateSuccess = false;
    this.form.reset();
    $('#foreignLanguage').select2({ data: [], placeholder: 'Select foreign languages', maximumSelectionLength: 5 }).trigger('change');
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
  }

  buildForm() {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      position: new FormControl(null, Validators.required),
      department: new FormControl(this.currentUser.departmentId.id, Validators.required),
      skills: new FormControl(null, Validators.required),
      priority: new FormControl(null, Validators.required),
      experience: new FormControl(null, Validators.required),
      project: new FormControl(null, Validators.required),
      group: new FormControl(null, Validators.required),
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
    if (value > this.constraints.number.max) {
      this.form.get('number').setValue(this.constraints.number.max);
    }
  }

  getIdsToDisplayWhenViewAppear() {
    // this._script.load('app-create-request-du-lead',
    //   'assets/demo/default/custom/components/forms/widgets/my-select2.js');
    this.skillIds = [];
    this.foreignLanguageIds = [];
    if (this.request) {
      for (const item of this.request.skillCollection) {
        this.skillIds.push(item.id);
      }
      for (const item of this.request.foreignLanguageCollection) {
        this.foreignLanguageIds.push(item.id);
      }
    }
    this.skills.setValue(this.skillIds);
    this.foreignLanguage.setValue(this.foreignLanguageIds);
  }

  subscriptionGetAllDataForSelectBox() {
    this.subscriptionPosition = this.getAllService.getAllPositions().subscribe((positions: Position[]) => {
      this.allPositions = positions;
    }, err => console.log('>>>> get positions error: ', err));
    this.subscriptionDepartment = this.getAllService.getAllDepartments().subscribe((departments: Department[]) => {
      this.listDepartment = departments;
    }, err => console.log('>>>> get departments error: ', err));
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
    this.subListGroup = this.getAllService.getAllGroups().subscribe((groups: Group[]) => {
      this.listGroup = groups;
    }, err => console.log(err));
  }

  navRequestList() {
    this.navigationService.navRequestList();
  }

  navRequestCreate() {
    this.navigationService.navRequestCreate();
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

  get group() {
    return this.form.get('group');
  }

  get title() {
    return this.form.get('title');
  }
  get position() {
    return this.form.get('position');
  }
  get department() {
    return this.form.get('department');
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

  onCancel() {
    this.navigationService.navRequestList();
  }

  onClickSkills() {
    this.skills.setErrors({ required: true });
  }

  ngOnDestroy() {
    if (this.subscriptionPosition) {
      this.subscriptionPosition.unsubscribe();
    }
    if (this.subscriptionDepartment) {
      this.subscriptionDepartment.unsubscribe();
    }
    if (this.subscriptionSkill) {
      this.subscriptionSkill.unsubscribe();
    }
    if (this.subscriptionExperience) {
      this.subscriptionExperience.unsubscribe();
    }
    if (this.subscriptionForeignLanguage) {
      this.subscriptionForeignLanguage.unsubscribe();
    }
    if (this.subscriptionProject) {
      this.subscriptionProject.unsubscribe();
    }
    if (this.subscriptionRecruitmentType) {
      this.subscriptionRecruitmentType.unsubscribe();
    }
    if (this.subscriptionPriority) {
      this.subscriptionPriority.unsubscribe();
    }
    if (this.subListGroup) {
      this.subListGroup.unsubscribe();
    }
  }
}
