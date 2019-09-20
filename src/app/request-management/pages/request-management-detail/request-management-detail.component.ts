import { REQUEST_SELECT } from './../../../core/redux/app/request-center/request-center.action';
import { IRootState } from './../../../core/redux/root.store';
import { Component, OnInit, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../../../model/user.class';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Request } from '../../../model/request.class';
import Utils from '../../../shared/helpers/util';
import { Project } from '../../../model/project.class';
import { Experience } from '../../../model/experience.class';
import { Skill } from '../../../model/skill.class';
import { RecruitmentType } from '../../../model/recruitment-type.class';
import { Position } from '../../../model/position.class';
import { Priority } from '../../../model/priority.class';
import { ForeignLanguage } from '../../../model/foreign-language.class';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../../../core/services/navigation.service';
import { GetAllService } from '../../../core/services/get-all.service';
import { IdentityService } from '../../../core/services/identity.service';
import { validateDeadline } from '../../../shared/custom-validator/deadline.validator';
import { Observable } from 'rxjs/Observable';
import { RequestManagementService } from '../../services/request-management.service';
import { select, NgRedux } from 'ng2-redux';
import { StoredProcedureService } from '../../services/stored-procedure.service';
import { Group } from '../../../model/group';
import { tassign } from 'tassign';
import { Department } from '../../../model/department.class';
import { Log } from '../../../model/log.class';

declare var $: any;
@Component({
  selector: 'app-request-management-detail',
  templateUrl: './request-management-detail.component.html',
  styleUrls: ['./request-management-detail.component.css']
})

export class RequestManagementDetailComponent implements OnInit, OnDestroy {

  @select((s: IRootState) => s.appStore.requestCenterStore.currentRequestId) currentRequestId$;

  // permissions
  canUpdate = false;
  canClone = false;
  canClose = false;
  //role
  isDuLead = false;
  isDuMember = false;
  isGroupLead = false;
  isHrManager = false;
  isHrMember = false;

  request: Request = null;
  urlRequestId: number;
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
  subscriptionListGroup: Subscription;
  subscriptionRecruitmentType: Subscription;
  subscriptionExperience: Subscription;
  subscriptionPriority: Subscription;
  skillIds = [];
  foreignLanguageIds = [];
  isCreateSuccess = false;
  isUpdateSuccess = false;
  CloseSuccess = false;
  isSubmitted = false;
  form: FormGroup;
  requestLogs: Log[];
  isUpdateLog = true;

  // skillsIsTouched = false;

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
    },
    rejectReason: {
      maxLength: 3000
    }
  };

  constructor(
    private requestService: RequestManagementService,
    private activatedRoute: ActivatedRoute,
    private navigationService: NavigationService,
    private getAllService: GetAllService,
    private identityService: IdentityService,
    private sp: StoredProcedureService,
    private ngRedux: NgRedux<IRootState>
  ) {
    // set roles
    this.isDuLead = this.identityService.isDuLead();
    this.isDuMember = this.identityService.isDuMember();
    this.isHrManager = this.identityService.isHrManager();
    this.isHrMember = this.identityService.isHrMember();
    this.isGroupLead = this.identityService.isGroupLead();
  }

  ngOnInit() {
    // set permissions
    const currentUser = this.identityService.getCurrentUser();
    this.canClone = currentUser.permission.cloneRequest;
    this.canUpdate = currentUser.permission.editRequest;
    this.canClose = currentUser.permission.closeRequest;

    this.buildForm();
    Observable.combineLatest(
      this.currentRequestId$,
      this.activatedRoute.paramMap
    ).subscribe(res => {
      const storeRequestId = res[0];
      this.urlRequestId = +res[1].get('id');
      if (this.urlRequestId !== storeRequestId || !this.sp.getRequest(this.urlRequestId)) {
        this.ngRedux.dispatch({
          type: REQUEST_SELECT,
          payload: this.urlRequestId
        });
        this.requestService.getOne(this.urlRequestId).subscribe(req => {
          this.request = req;
          this.initFormData();
        });
      } else {
        this.request = this.sp.getRequest(this.urlRequestId);
      }
      this.initFormData();
    });
    this.subscriptionGetAllDataForSelectBox();
  }

  initFormData() {
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
      this.rejectReason.setValue(this.request.rejectReason);
    } else {
      this.number.setValue(null);
    }
  }

  getFormValue(): Request {
    const request = Object.assign({}, this.request);
    const deadline = this.deadline.value;
    request.id = this.request.id;
    request.title = this.title.value;
    request.positionId = new Position(parseInt(this.position.value, 10));
    request.departmentId = new Department(parseInt(this.department.value, 10));
    request.number = parseInt(this.number.value, 10);
    request.deadline = (this.deadline.value == null)
      ? null
      : Utils.dateToString(Utils.createDate(deadline.year, deadline.month, deadline.day));
    let projectNew = new Project();
    projectNew.id = this.project.value;
    request.projectId = projectNew;
    request.groupId = new Group(parseInt(this.group.value, 10));
    request.recruitmentTypeId = new RecruitmentType(parseInt(this.recruitmentType.value, 10));
    request.priorityId = new Priority(parseInt(this.priority.value, 10));
    const skillIdCollection = this.skills.value || [];
    request.skillCollection = [];
    if (skillIdCollection.length > 0) {
      for (const skillId of skillIdCollection) {
        request.skillCollection.push(new Skill(skillId));
      }
    }
    request.experienceId = new Experience(parseInt(this.experience.value, 10));
    request.description = this.description.value;
    const foreignLanguageIdCollection = this.foreignLanguage.value || [];
    request.foreignLanguageCollection = [];
    if (foreignLanguageIdCollection.length > 0) {
      for (const foreignLanguageId of foreignLanguageIdCollection) {
        request.foreignLanguageCollection.push(new ForeignLanguage(foreignLanguageId));
      }
    }
    request.certificate = (this.certificate.value == null) ? '' : this.certificate.value;
    request.major = (this.major.value == null) ? '' : this.major.value;
    request.others = (this.others.value == null) ? '' : this.others.value;
    request.salary = (this.salary.value == null) ? '' : this.salary.value;
    request.benefit = (this.benefit.value == null) ? '' : this.benefit.value;
    request.rejectReason = (this.rejectReason.value == null) ? '' : this.rejectReason.value;
    return request;
  }

  onUpdate() {
    this.isUpdateLog = false;
    this.requestService.update(this.getFormValue()).subscribe((response) => {
      if (response.responseStatus === 200) {
        this.isUpdateSuccess = true;
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
        this.getIdsToDisplayWhenViewAppear();
        this.isUpdateLog = true;
      }
    }, err => {
      console.log(err);
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    return !this.hasUnsavedData();
  }

  hasUnsavedData() {
    return !(this.isSubmitted || !this.form.dirty);
  }

  clone() {
    // TODO: Thực hiện chức năng clone request
  }

  close(name: string) {
    if(name) {
      confirm("Are you sure to close "+ name);
    }
    this.requestService.close(this.request).subscribe((response) => {
      this.CloseSuccess = true;
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    }, err => {
      console.log(err);
    });
  }

  onReset() {
    this.isSubmitted = false;
    this.isCreateSuccess = false;
    this.form.reset();
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
  }

  buildForm() {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      position: new FormControl({ value: '', disabled: !this.canUpdate }, Validators.required),
      department: new FormControl({ value: '', disabled: !this.canUpdate }, Validators.required),
      skills: new FormControl({ value: '', disabled: !this.canUpdate }, Validators.required),
      priority: new FormControl({ value: '', disabled: !this.canUpdate }, Validators.required),
      experience: new FormControl({ value: '', disabled: !this.canUpdate }, Validators.required),
      project: new FormControl({ value: '', disabled: !this.canUpdate }, Validators.required),
      group: new FormControl({ value: '', disabled: !this.canUpdate }, Validators.required),
      recruitmentType: new FormControl({ value: '', disabled: !this.canUpdate }, Validators.required),
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
      rejectReason: new FormControl(null),
      foreignLanguage: new FormControl({ value: '', disabled: !this.canUpdate })
    });
  }

  getIdsToDisplayWhenViewAppear() {
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
    this.subscriptionListGroup = this.getAllService.getAllGroups().subscribe((groups: Group[]) => {
      this.listGroup = groups;
    }, err => console.log(err));
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
  get rejectReason() {
    return this.form.get('rejectReason');
  }

  onCancel() {
    this.navigationService.navRequestList();
  }
  numberChange($event) {
    console.log($event);
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
    if (this.subscriptionListGroup) {
      this.subscriptionListGroup.unsubscribe();
    }
  }

}

