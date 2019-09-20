import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../model/user.class';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Request } from '../../../model/request.class';
import Utils from '../../../shared/helpers/util';
import { Position } from '../../../model/position.class';
import { Project } from '../../../model/project.class';
import { RecruitmentType } from '../../../model/recruitment-type.class';
import { Priority } from '../../../model/priority.class';
import { Skill } from '../../../model/skill.class';
import { Experience } from '../../../model/experience.class';
import { ForeignLanguage } from '../../../model/foreign-language.class';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../../../core/services/navigation.service';
import { GetAllService } from '../../../core/services/get-all.service';
import { IdentityService } from '../../../core/services/identity.service';
import { validateDeadline } from '../../../shared/custom-validator/deadline.validator';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/switchMap';
import { RequestManagementService } from '../../services/request-management.service';
@Component({
  selector: 'app-request-management-detail-du-member',
  templateUrl: './request-management-detail-du-member.component.html',
  styleUrls: ['./request-management-detail-du-member.component.css']
})
export class RequestManagementDetailDuMemberComponent implements OnInit, OnDestroy {
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
  form: FormGroup;
  currentUser: User;

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

  setDataForViewInit() {
    this.getIdsToDisplayWhenViewAppear();
    this.title.setValue(this.request.title);
    this.position.setValue(this.request.positionId.title);
    this.deadline.setValue(this.request.deadline);
    this.project.setValue(this.request.projectId.title);
    this.recruitmentType.setValue(this.request.recruitmentTypeId.title);
    this.priority.setValue(this.request.priorityId.title);
    this.experience.setValue(this.request.experienceId.title);
    this.number.setValue(this.request.number);
    this.description.setValue(this.request.description);
    this.certificate.setValue(this.request.certificate);
    this.major.setValue(this.request.major);
    this.others.setValue(this.request.others);
    this.salary.setValue(this.request.salary);
    this.benefit.setValue(this.request.benefit);
  }

  ngOnInit() {
    this.buildForm();
    this.currentUser = this.identityService.getCurrentUser();
    this.subscriptionGetOneRequest();
    this.subscriptionGetAllDataForSelectBox();
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

  constructor(
    private requestManagementService: RequestManagementService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private navigationService: NavigationService,
    private getAllService: GetAllService,
    private identityService: IdentityService
  ) { }

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

  getIdsToDisplayWhenViewAppear() {
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
