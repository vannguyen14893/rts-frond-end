import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CvService } from '../../service/cv.service';
import { IdentityService } from '../../../core/services/identity.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { SkillService } from '../../../admin/config/skill/services/skill.service';
import { User } from '../../../model/user.class';
import { Subscription } from 'rxjs/Subscription';
import { Page } from '../../../model/page.class';
import { Cv } from '../../../model/cv.class';
import { HttpErrorResponse } from '@angular/common/http';
import { Request } from '../../../model/request.class';
import { ActionCreatorService } from '../../../core/services/action-creator.service';
import { select } from 'ng2-redux';
import { IRootState } from '../../../core/redux/root.store';
import { StoredProcedureService } from '../../../core/services/stored-procedure.service';
import { RequestManagementService } from '../../../request-management/services/request-management.service';
import { GetAllService } from "../../../core/services/get-all.service";
import { CertificationService } from '../../../admin/config/certification/services/certification.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

@Component({
  selector: 'app-cv-list-v2',
  templateUrl: './cv-list-v2.component.html',
  styleUrls: ['./cv-list-v2.component.css']
})

export class CvListV2Component implements OnInit, OnDestroy {

  @select((s: IRootState) => s.appStore.cvListStore.redirectedRequestId) redirectedRequestId$;


  requestInput: Request;
  @Output() submitted$ = new EventEmitter<void>();

  currentUser: User;
  resultMessage: string;
  subscriptionCv: Subscription;
  subscriptionSkill: Subscription;
  subscriptionExperience: Subscription;
  subscriptionCvStatus: Subscription;
  subscriptionRequest: Subscription;
  subListHrMember: Subscription;
  subListCertification: Subscription;

  // subscriptionSortedColum: Subscription;
  subscriptionRequestByAssign: Subscription;
  private subMakeCandidate2: Subscription;
  private subRequestParam: Subscription;
  // biến chứa giá trị một requestId trong bảng Candidate, nếu >0 cho phép chọn CV trước khi make candidate.
  private selectedRequestId: number;

  public disableSelecBox: Boolean;
  public skillList;
  public experienceList;
  public allHrMember: User[];
  public certifications;
  public requestList;
  public statusList;
  public requestsAssign;
  public inputSearch: string;

  cvs: Cv[];

  requestPage: Page<any>;
  listSelectedCV: Cv[];
  listMessageErrorMakeCandidate = [];
  public onViewTable: boolean;

  form: FormGroup;

  requestParams = {
    input: '',
    hrId: '',
    requestId: '',
    skillId: [],
    experienceId: [],
    statusId: [],
    certificationId: [],
    requestIdOfCandidate: '',
    page: 0,
    size: 20,
    sort: 'createdDate,desc'
  };

  constructor(
    private cvService: CvService,
    private requestService: RequestManagementService,
    private identityService: IdentityService,
    private navigationService: NavigationService,
    private skillService: SkillService,
    private ac: ActionCreatorService,
    private sp: StoredProcedureService,
    private fb: FormBuilder,
    private getAllService: GetAllService,
    private certificationService: CertificationService,
    private route: ActivatedRoute,
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.onViewTable = true;
    this.inputSearch = '';

    this.subRequestParam = Observable.combineLatest([
      this.route.queryParams,
    ]).subscribe(combined => {
      const requestParams: any = combined[0];
      if (requestParams.sort) {
        this.requestParams.input = (requestParams.input) ? requestParams.input : '';
        this.requestParams.hrId = (requestParams.hrId) ? requestParams.hrId : '';
        this.requestParams.requestId = (requestParams.requestId) ? requestParams.requestId : '';
        this.requestParams.skillId = (requestParams.skillId) ? requestParams.skillId.split(',').map(Number) : [];
        this.requestParams.experienceId = (requestParams.experienceId) ? requestParams.experienceId.split(',').map(Number) : [];
        this.requestParams.statusId = (requestParams.statusId) ? requestParams.statusId.split(',').map(Number) : [];
        this.requestParams.certificationId = (requestParams.certificationId) ? requestParams.certificationId.split(',').map(Number) : [];
        this.requestParams.requestIdOfCandidate = (requestParams.requestIdOfCandidate) ? requestParams.requestIdOfCandidate : '';
        this.requestParams.page = requestParams.page;
        this.requestParams.size = requestParams.size;
        this.requestParams.sort = requestParams.sort;

        //Set value for form
        this.hrId.setValue((this.requestParams.hrId === '') ? null : +this.requestParams.hrId);
        this.requestId.setValue((this.requestParams.requestId === '') ? null : +this.requestParams.requestId);
        this.skillCollection.setValue(this.requestParams.skillId);
        this.experienceCollection.setValue(this.requestParams.experienceId);
        this.statusCollection.setValue(this.requestParams.statusId);
        this.certificationColection.setValue(this.requestParams.certificationId);
      }
      // get request to make candidate
      this.redirectedRequestId$.subscribe(id => {
        this.requestInput = this.sp.getRequest(id);
      });
      this.listSelectedCV = [];
      this.listMessageErrorMakeCandidate = [];
      this.resultMessage = '';

      this.currentUser = this.identityService.getCurrentUser();

      // lấy các request được assignee cho user, sau đó chọn mới enable make candidate.
      this.selectedRequestId = this.requestInput ? this.requestInput.id : 0;
      this.requestParams.requestIdOfCandidate = this.selectedRequestId.toString();
      this.subscriptionRequestByAssign = this.cvService.findAssignedRequestsBelongAssignee().subscribe(
        data => {
          this.requestsAssign = data;
        }, err => console.log('errr get request Assign for user >>> ', err));

      this.getCvs(this.requestParams);

      const param = { arraySatusRequest: 'In-Progress,Approved,Pending' };
      this.subscriptionRequest = this.cvService.getAllRequestAccept(param).subscribe(data => {
        this.requestList = data;
      }, err => console.log('errr get request >>> ', err));

      this.subscriptionSkill = this.skillService.getAll().subscribe(data => {
        this.skillList = data;
      }, err => console.log('>>>> get skills error: ', err));
      this.subscriptionExperience = this.cvService.getAllExperience().subscribe(data => {
        this.experienceList = data;
      }, err => console.log('errr get experience >>> ', err));
      this.subscriptionCvStatus = this.cvService.getStatusCv().subscribe(data => {
        this.statusList = data;
      }, err => console.log('errr get status >>> ', err));

      //
      this.subListHrMember = this.getAllService.getAllHrMember().subscribe((hrmembers: User[]) => {
        this.allHrMember = hrmembers;
      }, err => console.log('>>>>>> get hrmember error: ', err));

      this.subListCertification = this.certificationService.findAll().subscribe(data => {
        this.certifications = data.content;
      }, err => console.log('>>>>>> get hrmember error: ', err));
    });
  }

  private getCvs(param) {
    this.subscriptionCv = this.cvService.getAll(param).subscribe((page: Page<any>) => {
      this.requestPage = page;

      if (page) {
        this.cvs = page.content;
        // call function get candidate by CV id;
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      } else {
        this.resultMessage = 'We found no request.';
        this.cvs = null;
      }
    }, (err: HttpErrorResponse) => {
      this.resultMessage = err.message;
    });
  }


  // cách build form của Hoàn, cho phép validate với API
  buildForm() {
    this.form = this.fb.group({
      hrId: [],
      requestId: [],
      skillCollection: [''],
      experienceCollection: [''],
      statusCollection: [''],
      certificationColection: [''],
    });
  }

  filter() {
    this.inputSearch = '';
    this.resultMessage = '';
    this.requestParams.input = '';
    this.requestParams.page = 0;
    this.requestParams.size = 20;
    this.requestParams.skillId = [];
    this.requestParams.statusId = [];
    this.requestParams.experienceId = [];
    this.requestParams.requestId = '';
    this.requestParams.certificationId = [];

    const skillIdCollection = this.skillCollection.value || [];
    if (skillIdCollection.length > 0) {
      for (const skillId of skillIdCollection) {
        this.requestParams.skillId.push(skillId);
      }
    }
    // console.log("list skill ", this.requestParams.skillId)
    const statusCollection = this.statusCollection.value || [];
    if (statusCollection.length > 0) {
      for (const statusId of statusCollection) {
        this.requestParams.statusId.push(statusId);
      }
    }
    // console.log("status filter ", this.requestParams.statusId)
    const experienceCollection = this.experienceCollection.value || [];
    if (experienceCollection.length > 0) {
      for (const experienceId of experienceCollection) {
        this.requestParams.experienceId.push(experienceId);
      }
    }
    // console.log("experience filter ", this.requestParams.experienceId)
    // sau khi click dấu x bỏ filter request, value của requestId = string null -> server không thể case được -> long lỗi 500 cần phải loại bỏ.
    if (this.requestId.value === null)
      this.requestParams.requestId = '';
    else
      this.requestParams.requestId = this.requestId.value;
    this.requestParams.requestIdOfCandidate = this.selectedRequestId.toString();
    // tương tự với hr id
    if (this.hrId.value === null)
      this.requestParams.hrId = '';
    else
      this.requestParams.hrId = this.hrId.value;
      
    this.navigationService.navCvSearchListWithParam(this.requestParams);
    // this.getCvs(this.requestParams);
  }

  viewTable() {
    this.onViewTable = !this.onViewTable
  }

  viewCvDetail(cv) {
    this.cvService.cv = cv;
    this.navigationService.navCvDetail(cv.id);
  }

  search(title) {
    //remove value and view of filter if search
    this.resultMessage = '';
    this.requestParams.page = 0;
    this.requestParams.requestId = '';
    this.requestParams.skillId = [];
    this.requestParams.statusId = [];
    this.requestParams.experienceId = [];
    this.form.reset();
    this.requestParams.input = title;
    this.navigationService.navCvSearchListWithParam(this.requestParams);
    // this.getCvs(this.requestParams);
  }
  prev() {
    if (!this.requestPage.first) {
      this.requestParams.page = this.requestPage.number - 1;
      this.navigationService.navCvSearchListWithParam(this.requestParams);
      // this.getCvs(this.requestParams);
    }
  }
  first() {
    if (!this.requestPage.first) {
      this.requestParams.page = 0;
      this.navigationService.navCvSearchListWithParam(this.requestParams);
      // this.getCvs(this.requestParams);
    }
  }
  next() {
    if (!this.requestPage.last) {
      this.requestParams.page = this.requestPage.number + 1;
      this.navigationService.navCvSearchListWithParam(this.requestParams);
      // this.getCvs(this.requestParams);
    }
  }
  last() {
    if (!this.requestPage.last) {
      this.requestParams.page = this.requestPage.totalPages - 1;
      this.navigationService.navCvSearchListWithParam(this.requestParams);
      // this.getCvs(this.requestParams);
    }
  }

  onChangeComBoBox(selectedValue) {
    // remove all messages
    this.resultMessage = '';
    this.listMessageErrorMakeCandidate = [];
    // remove item if change Request in Combobox
    this.removeListSelectedCv();

    this.selectedRequestId = selectedValue;
    // query khi value bị thay đổi.
    this.reloadList();
  }

  private removeListSelectedCv() {
    if (this.listSelectedCV.length > 0) {
      this.listSelectedCV.forEach(item => {
        item.selected = false;
      });
      this.listSelectedCV = [];
    }
  }
  private reloadList() {
    //remove data in control search and filter. but view not change-> miss fix???
    this.requestParams = Object.assign({}, {
      input: '',
      hrId: '',
      requestId: '',
      skillId: [],
      experienceId: [],
      statusId: [],
      certificationId: [],
      requestIdOfCandidate: '',
      page: 0,
      size: 20,
      sort: 'createdDate,desc'
    });
    this.form.reset();
    this.requestParams.requestIdOfCandidate = this.selectedRequestId.toString();
    this.getCvs(this.requestParams);
  }

  mouseEnter(cv: Cv) {
    cv.hover = true;
  }
  mouseLeave(cv: Cv) {
    cv.hover = false;
  }

  addToListSelectedCV(cv: Cv) {
    this.resultMessage = '';
    this.listMessageErrorMakeCandidate = [];

    // nếu có selectedRequestId >0 được lựa chọn CV.
    if (this.selectedRequestId > 0) {

      const index = this.listSelectedCV.findIndex(c => c.id === cv.id);
      if (index === -1) {
        this.listSelectedCV.push(cv);
        // set trạng thái lựa chọn 1 CV vào listSelect. đổi màu
        cv.selected = true;
      } else {
        this.listSelectedCV.splice(index, 1);
        cv.selected = false;
        if (this.listSelectedCV.length === 0) {
          // Khi mảng bị loại còn rỗng, query
          // this.reloadList();
        }
      }
    }
  }

  makeCandidate2() {
    // remove list message error
    this.listMessageErrorMakeCandidate = [];

    if (this.selectedRequestId > 0 && this.listSelectedCV.length > 0) {
      const arrayCvIds = [];
      this.listSelectedCV.forEach(o => {
        arrayCvIds.push(o.id);
      });
      const toMakeCandidate = {
        requestId: this.selectedRequestId,
        arrayCvIds: arrayCvIds
      };
      // make camdidate API.
      this.subMakeCandidate2 = this.cvService.makeCandidate2(toMakeCandidate)
        .subscribe(response => {

          this.resultMessage = 'make candidate success';
          this.reloadList();
          // Lấy lại danh sách Candidate của request hiện tại
          this.ac.fetchAllCandidatesOfCurrentRequest();
          if (this.requestInput) {
            this.navigationService.navRequestCenterDetail(this.requestInput.id);
          }
        }, error => {

          error.error.forEach(element => {
            this.listMessageErrorMakeCandidate.push(element);
            this.reloadList();
          });
        });

      // loại bỏ các Cv đã lựa chọn.
      this.removeListSelectedCv();
    }
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

  // Getting Form Controls
  get hrId() {
    return this.form.get('hrId');
  }
  get requestId() {
    return this.form.get('requestId');
  }
  get skillCollection() {
    return this.form.get('skillCollection');
  }
  get experienceCollection() {
    return this.form.get('experienceCollection');
  }
  get statusCollection() {
    return this.form.get('statusCollection');
  }
  get certificationColection() {
    return this.form.get('certificationColection');
  }

  ngOnDestroy(): void {
    if (this.subListHrMember) {
      this.subListHrMember.unsubscribe();
    }
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
    if (this.subMakeCandidate2) {
      this.subMakeCandidate2.unsubscribe();
    }
    if (this.subscriptionRequestByAssign) {
      this.subscriptionRequestByAssign.unsubscribe();
    }
    if (this.subListCertification) {
      this.subListCertification.unsubscribe();
    }
    if (this.subRequestParam) {
      this.subRequestParam.unsubscribe();
    }
  }

}
