import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ScriptLoaderService } from '../../../core/services/script-loader.service';
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
import { validateDeadline } from '../../../shared/custom-validator/deadline.validator';
import { IdentityService } from '../../../core/services/identity.service';
import { User } from '../../../model/user.class';
import { Status } from '../../../model/status.class';
import { RequestAssignee } from '../../../model/requestAssignee';
import { Helpers } from '../../../helpers';
import { RequestManagementService } from '../../services/request-management.service';
declare var $: any;
@Component({
  selector: 'app-request-management-detail-hr-member',
  templateUrl: './request-management-detail-hr-member.component.html',
  styleUrls: ['./request-management-detail-hr-member.component.css']
})
export class RequestManagementDetailHrMemberComponent implements OnInit {
  request: Request;
  allPositions;
  allSkills;
  allProjects;
  allHrMember;
  allHrMemberComboBox: User[][] = [];
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
  subscriptionHrMember: Subscription;
  skillIds = [];
  foreignLanguageIds = [];
  isUpdateSuccess = false;
  isSubmitted = false;
  isAssignSuccess = false;
  isCloseSuccess = false;
  form: FormGroup;
  form2: FormGroup;
  items: FormArray;
  quotaArray: number[];
  quotaRemain;
  isHrManager = false;
  isHrMember = false;
  private id;

  ngOnInit() {
    this.buildForm();
    this.subscriptionGetOneRequest();
    this.subscriptionGetAllDataForSelectBox();
  }

  createItem(assigneeId, number): FormGroup {
    return this.fb.group({
      requestAssignee: new FormControl(assigneeId, [
        Validators.required
      ]),
      number: new FormControl(number, [
        Validators.required,
        Validators.min(1)
      ])
    });
  }

  updateSelectBoxFormArray() {
    for (let i = 0; i < this.items.length; i++) {
      this.allHrMemberComboBox[i] = this.allHrMember.slice(0);
    }
    let userId = 0;
    for (let i = 0; i < this.items.length; i++) {
      userId = parseInt(this.form2.get(['items', i, 'requestAssignee']).value);
      for (let k = 0; k < this.items.length; k++) {
        if (k !== i) {
          for (let j = 0; j < this.allHrMemberComboBox[k].length; j++) {
            if (this.allHrMemberComboBox[k][j].id === userId) {
              this.allHrMemberComboBox[k].splice(j, 1);
            }
          }
        }
      }
    }
  }

  addItem(assigneeId, number): void {
    this.items = this.form2.get('items') as FormArray;
    this.items.push(this.createItem(assigneeId, number));
    this.updateSelectBoxFormArray();
  }

  reqAssigneeModalChange(value, index) {
    this.updateSelectBoxFormArray();
    for (let i = 0; i < this.items.length; i++) {
      if (i !== index) {
        for (let j = 0; j < this.allHrMemberComboBox[i].length; j++) {
          if (this.allHrMemberComboBox[i][j].id === parseInt(value)) {
            this.allHrMemberComboBox[i].splice(j, 1);
          }
        }
      }
    }
  }

  initItems() {
    if (this.request) {
      this.items = this.form2.get('items') as FormArray;
      for (let ra of this.request.requestAssignee) {
        this.items.push(this.createItem(ra.assignee.id, ra.numberOfCandidate));
      }
    }
  }

  deleteItem(index: number) {
    this.items = this.form2.get('items') as FormArray;
    this.items.removeAt(index);
    this.updateSelectBoxFormArray();
  }

  btnNewModalIsDisabled() {
    if (this.request) {
      let quotaRemain = this.request.number;
      this.items = this.form2.get('items') as FormArray;
      for (let i = 0; i < this.items.length; i++) {
        quotaRemain -= this.form2.get(['items', i, 'number']).value;
      }
      return (quotaRemain === 0 || this.form2.invalid) ? true : false;
    }
  }

  updateQuota() {
    this.quotaRemain = this.request.number;
    this.items = this.form2.get('items') as FormArray;
    for (let i = 0; i < this.items.length - 1; i++) {
      this.quotaRemain -= this.form2.get(['items', i, 'number']).value;
    }
  }

  numberChange(value) {
    if (value < this.constraints.number.min) {
      this.form.get("number").setValue(this.constraints.number.min);
    } else if (value > this.constraints.number.max) {
      this.form.get("number").setValue(this.constraints.number.max);
    }
  }

  numberModalChange(value, i) {
    this.updateQuota();
    if (value > this.quotaRemain) {
      this.form2.get(['items', i, 'number']).setValue(this.quotaRemain);
    }
  }

  onModalSubmit() {
    Helpers.setLoading(true);
    this.request.requestAssignee = [];
    for (let i = 0; i < this.items.length; i++) {
      let ra: RequestAssignee = new RequestAssignee();
      ra.request = new Request(this.request.id);
      ra.assignee = new User(parseInt(this.form2.get(['items', i, 'requestAssignee']).value));
      ra.numberOfCandidate = this.form2.get(['items', i, 'number']).value;
      this.request.requestAssignee.push(ra);
    }
    this.isAssignSuccess = false;
    this.requestManagementService.assign(this.request.requestAssignee, this.request.id).subscribe((res: any) => {
      this.isAssignSuccess = true;
      Helpers.setLoading(false);
      this.request.requestStatusId.title = "Assign";
      // while (this.items.length !== 0) {
      //   this.items.removeAt(0)
      // }
      // this.subscriptionGetOneRequest();
    }, err => {

    });
  }

  onModalClose() {
    Helpers.setLoading(true);
    this.requestManagementService.close(this.request).subscribe((res: any) => {
      Helpers.setLoading(false);
      this.request = res;
    }, err => {
      Helpers.setLoading(false);
    });
  }

  displayButtonClose() {
    if (this.request) {
      return (this.request.requestStatusId.id === 4) ? false : true;
    }
    return null;
  }

  onUpdate() {
    this.isSubmitted = true;
    this.isUpdateSuccess = false;
    this.updateRequestReceived();
    if (this.formIsValid()) {
      this.requestManagementService.update(this.request).subscribe((res: any) => {
        this.request = res
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
    this.form.reset();
    $('#skills').select2({ data: [], placeholder: "Select skills", maximumSelectionLength: 5 }).trigger("change");
    $('#foreignLanguage').select2({ data: [], placeholder: "Select foreign languages", maximumSelectionLength: 5 }).trigger("change");
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
  }

  onClone() {
    console.log($('#skills').val());
  }

  formIsValid() {
    return (this.title.valid && this.position.valid && this.number.valid && this.deadline.valid
      && this.project.valid && this.recruitmentType.valid && this.priority.valid && this.description.valid
      && this.experience.valid && $('#skills').val().length > 0) ? true : false;
  }

  isCanUpdate() {
    if (this.request) {
      return (this.request.requestStatusId.id === 2) ? true : false;
    }
    return null;
  }

  isCanAssign() {
    if (this.request) {
      return (this.request.requestStatusId.id === 5 || this.request.requestStatusId.id === 2) ? true : false;
    }
    return null;
  }

  skillsFieldIsValid() {
    return ($('#skills').val() == null || $('#skills').val().length === 0) ? false : true;
  }

  constructor(
    private requestManagementService: RequestManagementService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _script: ScriptLoaderService,
    private navigationService: NavigationService,
    private getAllService: GetAllService,
    private fb: FormBuilder,
    private identityService: IdentityService,
  ) {
    this.isHrManager = identityService.isHrManager();
    this.isHrMember = identityService.isHrMember();
  }

  buildForm() {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      position: new FormControl(null, Validators.required),
      skills: new FormControl(null, Validators.required),
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
      foreignLanguage: new FormControl(null),
      status: new FormControl(null),
    });
    this.form2 = this.fb.group({
      items: this.fb.array([])
    });
  }

  getIdsToDisplayWhenViewAppear() {
    this._script.load('app-request-detail-hr-member',
      'assets/demo/default/custom/components/forms/widgets/my-select2.js');
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
        this.id = 0;
        try {
          this.id = parseInt(combined[0].get('id'), 10);
        } catch (err) {
          this.id = 0;
        }
        return this.requestManagementService.getOne(+this.id);
      })
      .subscribe(res => {
        this.request = res;
        this.initItems();
        this.setDataForViewInit();
        console.log(this.request);
      }, err => console.log(err));
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
    this.request.skillCollection = new Array<Skill>();
    for (let item of $('#skills').val()) {
      this.request.skillCollection.push(new Skill(parseInt(Utils.getValueFromString(item))));
    }
    this.request.experienceId = new Experience(parseInt(this.experience.value));
    this.request.description = this.description.value;
    this.request.foreignLanguageCollection = new Array<ForeignLanguage>();
    for (let item of $('#foreignLanguage').val()) {
      this.request.foreignLanguageCollection.push(new ForeignLanguage(parseInt(Utils.getValueFromString(item))));
    }
    this.request.certificate = (this.certificate.value == null) ? "" : this.certificate.value;
    this.request.major = (this.major.value == null) ? "" : this.major.value;
    this.request.others = (this.others.value == null) ? "" : this.others.value;
    this.request.salary = (this.salary.value == null) ? "" : this.salary.value;
    this.request.benefit = (this.benefit.value == null) ? "" : this.benefit.value;
  }

  setDataForViewInit() {
    this.getIdsToDisplayWhenViewAppear();
    this.title.setValue(this.request.title);
    this.number.setValue(this.request.number);
    this.description.setValue(this.request.description);
    this.certificate.setValue(this.request.certificate);
    this.major.setValue(this.request.major);
    this.others.setValue(this.request.others);
    this.salary.setValue(this.request.salary);
    this.benefit.setValue(this.request.benefit);
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
    this.subscriptionHrMember = this.getAllService.getAllHrMember().subscribe((hrmembers: User[]) => {
      this.allHrMember = hrmembers;
      this.updateSelectBoxFormArray();
    }, err => console.log('>>>>>> get hrmember error: ', err));
  }

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

  navRequestList() {
    this.navigationService.navRequestList();
  }

  navRequestHome() {
    this.navigationService.navRequestHomeHrManager();
  }

  constraints = {
    title: {
      minLength: 1,
      maxLength: 100
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
      maxLength: 100
    },
    major: {
      maxLength: 3000
    },
    salary: {
      maxLength: 100
    },
    others: {
      maxLength: 3000
    },
    benefit: {
      maxLength: 3000
    }
  };

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

