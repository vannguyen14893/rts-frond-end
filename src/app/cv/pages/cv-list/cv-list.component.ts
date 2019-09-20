import { CvService } from './../../service/cv.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Page } from '../../../model/page.class';
import { IdentityService } from '../../../core/services/identity.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { SkillService } from '../../../admin/config/skill/services/skill.service';
import { User } from '../../../model/user.class';
import { Subscription } from 'rxjs/Subscription';
import { Cv } from '../../../model/cv.class';
import { CONFIG } from '../../../shared/constants/configuration.constant';
import { log } from 'util';
import { SortService } from '../../../core/services/sort.service';
import { sortByProperty } from './../../../shared/helpers/data.helper';

@Component({
  selector: 'app-cv-list',
  templateUrl: './cv-list.component.html',
  styleUrls: ['./cv-list.component.css']
})
export class CvListComponent implements OnInit, OnDestroy {

  sortDirection = 0;
  currentSortProperty = '';
  currentUser: User;
  resultMessage: string;
  subscriptionCv: Subscription;
  subscriptionSkill: Subscription;
  subscriptionExperience: Subscription;
  subscriptionCvStatus: Subscription;
  subscriptionRequest: Subscription;
  subscriptionSortedColum: Subscription;

  public skills;
  public experiences;
  public requests;
  public cvStatuss;
  cvs: Cv[];
  // private input: string = '';
  // private skillId: string = '';
  // private experienceId: string = '';
  // private statusId: string = '';
  // private requestId: string = '';
  requestPage: Page<any>;

  requestParams = {
    input: '',
    skillId: '',
    experienceId: '',
    statusId: '',
    requestId: '',
    page: 0,
    size: 10,
    sort: 'createdDate,desc'
  };


  constructor(
    private cvService: CvService,
    private identityService: IdentityService,
    private navigationService: NavigationService,
    private skillService: SkillService,
    private sortService: SortService,

  ) { }

  ngOnInit() {
    this.resultMessage = '';
    const param = { arraySatusRequest: 'Approved,Assign,Published,Pending' };
    this.currentUser = this.identityService.getCurrentUser();
    this.getCvs(this.requestParams);
    // const form = new FormData();
    // form.append( 'arraySatusRequest', param );
    // console.log(" data request "+ form);

    this.subscriptionSkill = this.skillService.getAll().subscribe(data => {
      this.skills = data;
    }, err => console.log('>>>> get skills error: ', err));
    this.subscriptionRequest = this.cvService.getAllRequestAccept(param).subscribe(data => {
      this.requests = data;
    }, err => console.log('errr get request >>> ' + err.error));
    this.subscriptionExperience = this.cvService.getAllExperience().subscribe(data => {
      this.experiences = data;
    }, err => console.log('errr get experience >>> ' + err));
    this.subscriptionCvStatus = this.cvService.getStatusCv().subscribe(data => {
      this.cvStatuss = data;
    }, err => console.log('errr get request >>> ' + err));
    this.subscriptionSortedColum = this.sortService.columnSorted$.subscribe(colName => {
      this.sort(colName);
    });
  }

  private getCvs(param) {
    this.subscriptionCv = this.cvService.getAll(param).subscribe((page: Page<any>) => {
      this.requestPage = page;
      if (page) {
        this.cvs = page.content;
      } else {
        this.resultMessage = 'We found no request.';
        this.cvs = null;
      }
    }, (err: HttpErrorResponse) => {
      this.resultMessage = err.message;
    });
  }
  filter(filterForm) {
    console.log(filterForm);
    this.resultMessage = '';
    this.requestParams.page = 0;
    this.requestParams.size = 10;
    this.requestParams.skillId = filterForm.value.skillId;
    this.requestParams.statusId = filterForm.value.statusId;
    this.requestParams.experienceId = filterForm.value.experienceId;
    this.requestParams.requestId = filterForm.value.requestId;
    this.getCvs(this.requestParams);
  }

  viewCvDetail(cv) {
    this.cvService.cv = cv;
    this.navigationService.navCvDetail(cv.id);
  }

  search(title) {
    this.resultMessage = '';
    this.requestParams.page = 0;
    this.requestParams.input = title;
    this.getCvs(this.requestParams);
  }
  prev() {
    if (!this.requestPage.first) {
      this.requestParams.page = this.requestPage.number - 1;
      this.getCvs(this.requestParams);
    }
  }
  first() {
    if (!this.requestPage.first) {
      this.requestParams.page = 0;
      this.getCvs(this.requestParams);
    }
  }
  next() {
    if (!this.requestPage.last) {
      this.requestParams.page = this.requestPage.number + 1;
      this.getCvs(this.requestParams);
    }
  }
  last() {
    if (!this.requestPage.last) {
      this.requestParams.page = this.requestPage.totalPages - 1;
      this.getCvs(this.requestParams);
    }
  }

  makeCandidate(cvId) {
    this.navigationService.navCandidateCreate(cvId);
  }

  navCvCreate() {
    this.navigationService.navCvCreate();
  }
  navCvList() {
    this.navigationService.navCvList();
  }
  getCvDetailUrl(cvId: number) {
    return '/cv/' + cvId;
  }

  sort(property: string) {
    if (this.currentSortProperty === '') {
      this.currentSortProperty = property;
    }
    if (this.currentSortProperty !== property) {
      this.sortDirection = 0;
      this.currentSortProperty = property;
    }

    this.sortDirection = (this.sortDirection === 0) ? 1 : (this.sortDirection === 1) ? -1 : 0;
    const currentSortParam = String(this.requestParams.sort) || '';
    const params = currentSortParam.split(',');
    if (params[0] === this.currentSortProperty) {
      if (params.length > 1) {
        if (params[1] === 'desc') {
          this.requestParams.sort = this.currentSortProperty + ',asc';
        } else if (params[1] === 'asc') {
          this.requestParams.sort = 'createdDate,desc';
        }
      }
    } else {
      this.requestParams.sort = this.currentSortProperty + ',desc';
    }
    this.getCvs(this.requestParams);
  }

  ngOnDestroy() {
    if (this.subscriptionCv) {
      this.subscriptionCv.unsubscribe();
    }
    if (this.subscriptionSkill) {
      this.subscriptionSkill.unsubscribe();
    }
    if (this.subscriptionRequest) {
      this.subscriptionRequest.unsubscribe();
    }
    if (this.subscriptionExperience) {
      this.subscriptionExperience.unsubscribe();
    }
    if (this.subscriptionCvStatus) {
      this.subscriptionCvStatus.unsubscribe();
    }
    if (this.subscriptionSortedColum) {
      this.subscriptionSortedColum.unsubscribe();
    }
  }
}

interface TimeOption {
  value: number;
  text: string;
}

