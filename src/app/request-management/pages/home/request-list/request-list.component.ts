import { ActivatedRoute } from '@angular/router';
import { ActionCreatorService } from '../../../../core/services/action-creator.service';
import { OnDestroy } from '@angular/core';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { select, NgRedux } from 'ng2-redux';
import { IRootState } from '../../../../core/redux/root.store';
import { RequestStatus } from '../../../../model/request-status.class';
import { Department } from '../../../../model/department.class';
import { Priority } from '../../../../model/priority.class';
import { Group } from '../../../../model/group';
import { User } from '../../../../model/user.class';
import { Request } from '../../../../model/request.class';
import { Subscription } from 'rxjs/Subscription';
import { RequestAssignee } from '../../../../model/requestAssignee';
import { CONFIG } from '../../../../shared/constants/configuration.constant';
import { Page } from '../../../../model/page.class';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { IdentityService } from '../../../../core/services/identity.service';
import { RequestManagementService } from '../../../services/request-management.service';
import { RequestStatusService } from '../../../../admin/config/request-status/service/request-status.service';
import { DepartmentService } from '../../../../admin/config/department/service/department.service';
import { PriorityService } from '../../../../admin/config/priority/service/priority.service';
import { UserService } from '../../../../admin/user/services/user.service';
import { ScriptLoaderService } from '../../../../core/services/script-loader.service';
import { NavigationService } from '../../../../core/services/navigation.service';
import { GetAllService } from '../../../../core/services/get-all.service';
import { REQUEST_SELECT, REQUEST_ASSIGNEE_SELECT } from '../../../../core/redux/app/request-center/request-center.action';
import { CANDIDATE_STATUS_CHANGE } from '../../../../core/redux/ui/request-center/request-center-ui.action';
import { CANDIDATE_STATUS } from '../../../../shared/constants/status.constant';
import { Helpers } from '../../../../helpers';
import { REQUEST_FETCH_SUCCESS } from '../../../../core/redux/domain/domain.action';
import { normalizeRequestArray } from '../../../../core/redux/domain/domain.normalization';
import { MODAL_REJECT_REQUEST, MODAL_CLOSE_REQUEST } from '../../../../shared/constants/modal.constant';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

declare var $: any;

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})
export class RequestListComponent implements OnInit, AfterViewInit, OnDestroy {

  @select((s: IRootState) => s.uiStore.requestCenterUiStore.currentModal) currentModal$;
  modalRejectRequest = MODAL_REJECT_REQUEST;
  modalCloseRequest = MODAL_CLOSE_REQUEST;

  currentUser: User; // To show avatar on comment box.
  listRequest: Request[];
  listRequestStatus: RequestStatus[];
  listDepartment: Department[];
  listPriority: Priority[];
  listUser: User[];
  listGroup: Group[];
  HrMemberId: string = '';
  // Groups
  isGroupDU = false;
  isGroupBO = false;

  // Roles
  isDuLead = false;
  isDuMember = false;
  isGroupLead = false;
  isHrManager = false;
  isHrMember = false;
  // Permissions
  canViewRequestDetail = false;
  canCreateCandidate = false;
  canCommentCandidate = false;
  canClose = false;
  CloseSuccess = false;
  percent: number;
  numberDate: number;

  private subListRequest: Subscription;
  private subListRequestStatus: Subscription;
  private subListDepartment: Subscription;
  private subListPriority: Subscription;
  private subListUser: Subscription;
  private subListGroup: Subscription;
  private subSubmitRequest: Subscription;
  private subApproveRequest: Subscription;
  private subAssignMember: Subscription;
  private subChangeTarget: Subscription;
  private subRequestParams: Subscription;
  private subPublicRequestParams: Subscription;

  private dynamicRequest: Request;
  dynamicRequestAssignee: RequestAssignee;
  paramsFindAll = {
    size: CONFIG.JAVA_MAX_INT,
  };
  requestParams = {
    requestStatusId: '',
    priorityId: '',
    departmentId: '',
    assigneeId: '',
    groupId: '',
    title: '',
    page: 0,
    size: CONFIG.PAGE_SIZE,
    sort: 'id,desc'
  };
  statusReports = [
    { name: 'Target', number: '-' },
    { name: 'Applied', number: '-' },
    { name: 'Contacting', number: '-' },
    { name: 'Interview', number: '-' },
    { name: 'Offer', number: '-' },
    { name: 'OnBoard', number: '-' },
  ];
  requestPage: Page<any>; // to get page number info
  // to show not found message
  resultMessage = '';

  errorTarget = true;

  response = {
    isSubmitting: false,
    isError: false,
    isSuccess: false,
    message: ''
  };

  form2: FormGroup;
  items: FormArray;
  allHrMemberComboBox: User[][] = [];
  allHrMember: any[];
  allFoundHrMember: any[];
  private subListHrMember: Subscription;
  isAssignSuccess = false;
  requestStatus = CANDIDATE_STATUS;

  constructor(
    private identityService: IdentityService,
    private requestService: RequestManagementService,
    private requestStatusService: RequestStatusService,
    private departmentService: DepartmentService,
    private priorityService: PriorityService,
    private userService: UserService,
    private _scriptLoaderService: ScriptLoaderService,
    private navigationService: NavigationService,
    private fb: FormBuilder,
    private getAllService: GetAllService,
    private ngRedux: NgRedux<IRootState>,
    private ac: ActionCreatorService,
    private route: ActivatedRoute,
  ) {
    this.currentUser = this.identityService.getCurrentUser();
    // set permissions
    this.canCommentCandidate = this.currentUser.permission.commentCandidate;
    this.canCreateCandidate = this.currentUser.permission.createCandidate;
    this.canViewRequestDetail = this.currentUser.permission.viewRequestDetail;
    // set roles
    this.isDuLead = this.identityService.isDuLead();
    this.isDuMember = this.identityService.isDuMember();
    this.isHrManager = this.identityService.isHrManager();
    this.isHrMember = this.identityService.isHrMember();
    this.isGroupLead = this.identityService.isGroupLead();
    this.isGroupDU = this.identityService.isGroupDU();
    this.isGroupBO = this.identityService.isGroupBO();

    this.form2 = this.fb.group({
      items: this.fb.array([])
    });
  }

  ngOnInit() {
    this.subRequestParams = Observable.combineLatest([
      this.route.queryParams
    ]).subscribe(combined => {
      const requestParams = combined[0];

      if (requestParams.sort && requestParams.page && requestParams.size) {
        this.requestParams.requestStatusId = (requestParams.requestStatusId === '') ? '' : requestParams.requestStatusId.split(',').map(Number);
        this.requestParams.priorityId = requestParams.priorityId;
        this.requestParams.departmentId = (requestParams.departmentId === '') ? '' : requestParams.departmentId.split(',').map(Number);
        this.requestParams.assigneeId = requestParams.assigneeId;
        this.requestParams.groupId = requestParams.groupId;
        this.requestParams.title = requestParams.title;
        this.requestParams.page = requestParams.page;
        this.requestParams.size = requestParams.size;
        this.requestParams.sort = requestParams.sort;
      }
      const currentUser = this.identityService.getCurrentUser();
      this.canClose = currentUser.permission.closeRequest;

      this.subListRequestStatus = this.requestStatusService.findAll(this.paramsFindAll)
        .subscribe(statuses => {
          this.listRequestStatus = statuses.content;

          this.subListDepartment = this.departmentService.findAll(this.paramsFindAll)
            .subscribe(departments => {
              this.listDepartment = departments.content;

              this.subListUser = this.userService.getAssigneeList()
                .subscribe(users => {
                  this.listUser = users;
                  this.customFilterCorrespondingRole();
                  this.getRequests();
                });
            });
        });
      this.subListPriority = this.priorityService.findAll(this.paramsFindAll)
        .subscribe(response => {
          this.listPriority = response.content;
        });
      this.subListHrMember = this.getAllService.getAllHrMember().subscribe((hrmembers: User[]) => {
        this.allHrMember = hrmembers;
        this.allFoundHrMember = hrmembers;
      }, err => console.log('>>>>>> get hrmember error: ', err));
      this.subListGroup = this.getAllService.getAllGroups().subscribe((groups: Group[]) => {
        this.listGroup = groups;
      }, err => console.log(err));

    });
  }

  createFormAssignee() {
    this.form2 = this.fb.group({
      items: this.fb.array([])
    });
  }
  get formData() { return <FormArray>this.form2.get('items'); }

  private convertRequest(requests: Request[]): Request[] {
    let currentDate = moment().format("DD/MM/YYYY");
    for (const request of requests) {
      if (!(request.requestStatusId.title == 'Closed' || request.requestStatusId.title == 'Rejected')) {
        request.overDue = moment(currentDate, "DD/MM/YYYY").diff(moment(request.deadline, "DD/MM/YYYY"), 'days') > 0;
      } else {
        request.overDue = false;
      }
      if (request.isFinish) {
        request.overDue = false;
      }
      this.subDate(request);
    }
    return requests;
  }

  filter() {
    this.requestParams.title = '';
    this.resultMessage = '';
    this.requestParams.page = 0;
    this.navigationService.navRequestSearchListWithParam(this.requestParams);
    // this.getRequests();
  }
  search(titleForm) {
    this.requestParams.requestStatusId = '';
    this.requestParams.priorityId = '';
    this.requestParams.departmentId = '';
    this.requestParams.assigneeId = '';
    this.requestParams.groupId = '';
    this.requestParams.title = titleForm;
    this.resultMessage = '';
    this.requestParams.page = 0;
    this.navigationService.navRequestSearchListWithParam(this.requestParams);
    // this.getRequests();
  }
  prev() {
    if (!this.requestPage.first) {
      this.requestParams.page = this.requestPage.number - 1;
      this.navigationService.navRequestSearchListWithParam(this.requestParams);
      // this.getRequests();
    }
  }
  first() {
    if (!this.requestPage.first) {
      this.requestParams.page = 0;
      this.navigationService.navRequestSearchListWithParam(this.requestParams);
      // this.getRequests();
    }
  }
  next() {
    if (!this.requestPage.last) {
      this.requestParams.page = this.requestPage.number + 1;
      this.navigationService.navRequestSearchListWithParam(this.requestParams);
      // this.getRequests();
    }
  }
  last() {
    if (!this.requestPage.last) {
      this.requestParams.page = this.requestPage.totalPages - 1;
      this.navigationService.navRequestSearchListWithParam(this.requestParams);
      // this.getRequests();
    }
  }

  subDate(request: Request) {
    const date1 = request.deadline.split('/');
    const deadlineDate = new Date(+date1[2], +date1[1] - 1, +date1[0]);
    const date2 = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    const diff = deadlineDate.getTime() - date2.getTime();
    if (diff < 0) {
      return request.remainDate = Math.abs(diff / (1000 * 60 * 60 * 24));
    }
    request.remainDate = diff / (1000 * 60 * 60 * 24);
  }
  getHrMemberId(value) {
    this.HrMemberId = value;
  }
  customFilterCorrespondingRole() {
    const foundStatusIsNew = this.listRequestStatus.filter(o => o.title === 'New')[0];
    const foundStatusIsApproved = this.listRequestStatus.filter(o => o.title === 'Approved')[0];
    const foundStatusIsInProgess = this.listRequestStatus.filter(o => o.title === 'In-Progress')[0];
    const foundStatusIsPending = this.listRequestStatus.filter(o => o.title === 'Pending')[0];
    const foundStatusIsClosed = this.listRequestStatus.filter(o => o.title === 'Closed')[0];
    const foundStatusIsRejected = this.listRequestStatus.filter(o => o.title === 'Rejected')[0];
    
    if (this.isDuLead) {
      // DU LEAD is only scout themself request that belong their department.
      this.listDepartment = [this.currentUser.departmentId];
      this.requestParams.departmentId = this.currentUser.departmentId.id.toString();
    }
    if (this.isDuMember) {
      // HR MANAGER cannot scout New, Pending and rejected request
      this.listDepartment = [this.currentUser.departmentId];
      this.listRequestStatus = [foundStatusIsInProgess];
      this.requestParams.departmentId = this.currentUser.departmentId.id.toString();
      this.requestParams.requestStatusId = foundStatusIsInProgess.id.toString();
    }
    if (this.isHrManager) {
      // HR MANAGER cannot scout Pending and rejected request
      this.listRequestStatus = [
        foundStatusIsNew,
        foundStatusIsApproved,
        foundStatusIsInProgess,
        foundStatusIsClosed,
        foundStatusIsRejected

      ];
    }

    if (this.isHrMember) {
      this.listRequestStatus = [
        foundStatusIsNew,
        foundStatusIsApproved,
        foundStatusIsInProgess,
        foundStatusIsClosed,
        foundStatusIsRejected
      ];
      // HR MEMBER is only scout yourself request these are in progess
      //this.listRequestStatus = [foundStatusIsInProgess];
      //this.listUser = [this.currentUser];
      //this.requestParams.requestStatusId = this.listRequestStatus.toString();
      //this.requestParams.assigneeId = this.HrMemberId;
    }
    if (this.isGroupLead) {
      // GROUP LEAD cannot scout New request
      this.listRequestStatus.splice(this.listRequestStatus.findIndex(o => o.title === 'New'), 1);
      // this.requestParams.requestStatusId = foundStatusIsPending.id.toString();
    }
  }
  onSetUpDynamicRequest(request) {
    this.dynamicRequest = request;
  }
  rejectRequest(request: Request) {
    this.ac.rejectRequest(request.id);
    this.ac.openModal(this.modalRejectRequest);
  }

  closeRequest(request: Request) {
    this.ac.closeRequest(request.id);
    this.ac.openModal(this.modalCloseRequest);
  }

  onCenterDetail(requestID) {
    this.navigateToRequestCenter(requestID, 0, this.requestStatus.APPLIED);
  }

  onCenterDetailWithAssignee(requestID, assigneeID) {
    this.navigateToRequestCenter(requestID, assigneeID, this.requestStatus.APPLIED);
  }

  onCenterDetailWithAssigneeAndStatus(requestID, assigneeID, status) {
    this.navigateToRequestCenter(requestID, assigneeID, status);
  }

  navigateToRequestCenter(requestID, assigneeID, status) {
    this.ac.setRequestCenterStatus(requestID, assigneeID, status, 'Qualified', 0);
    this.navigationService.navRequestCenterDetail(requestID);
  }

  checkOutRequestDetail() {
    this.navigationService.navRequestCreate();
  }

  onDetail(id) {
    this.ngRedux.dispatch({
      type: REQUEST_SELECT,
      payload: id
    });
    this.navigationService.navRequestDetail(id);
  }

  onCreate() {
    this.navigationService.navRequestCreate();
  }

  onSubmitRequest() {
    if (this.dynamicRequest && this.dynamicRequest.requestStatusId.title === 'New') {
      Helpers.setLoading(true);
      this.response.isSubmitting = true;
      this.subSubmitRequest = this.requestService.submitNewRequest(this.dynamicRequest)
        .subscribe((response: Request) => {
          if (response.requestStatusId.title === 'Pending') {
            Helpers.setLoading(false);
            this.response.isSubmitting = false;
            $('#modal-submit-request').modal('toggle');
            this.getRequests();
            // $(".modal-reject-request");
          }
        }, err => {
          Helpers.setLoading(false);
        });
    }
  }

  onApprove() {
   // Helpers.setLoading(true);
    this.response.isSubmitting = true;
    this.subApproveRequest = this.requestService.setApproveRequest(this.dynamicRequest, this.dynamicRequest.id)
      .subscribe((response: Request) => {
        if (response.requestStatusId.title === 'Approved') {
          this.response.isSuccess = true;
          this.response.isError = false;
          this.response.message = 'This request has been approved successful';
          setTimeout(() => {
            Helpers.setLoading(false);
            this.response.isSubmitting = false;
            $('#modal-approve-request').modal('toggle');
            this.dynamicRequest = undefined;
            this.getRequestss();
            this.response.message = '';
          }, 2000);
        }
      }, err => {
        Helpers.setLoading(false);
        this.response.isSubmitting = false;
        this.response.isSuccess = false;
        this.response.isError = true;
        this.response.message = err.error;
      });
  }

  private getRequests() {
    Helpers.setLoading(true);
    this.subListRequest = this.requestService.filter(this.requestParams)
      .subscribe((page: Page<any>) => {
        this.requestPage = page;
        this.ngRedux.dispatch({
          type: REQUEST_FETCH_SUCCESS,
          payload: normalizeRequestArray(page.content)
        });
        this.listRequest = page.content;
        this.listRequest = this.convertRequest(page.content);
        Helpers.setLoading(false);
        if (this.listRequest.length === 0) {
          this.resultMessage = 'No requests found!';
        } else {
          window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
        }
      }, err => {
        this.resultMessage = err.error;
      });
  }

  openNewAssignMember(request) {
    this.createFormAssignee();
    this.dynamicRequest = request;
    this.allHrMember = this.allFoundHrMember.slice(0);
    // đoạn này kiểm tra xem trong cái request đấy đã có thằng assignee nào chưa
    // nếu có sẽ trừ bớt
    if (request.requestAssignee && request.requestAssignee.length > 0) {
      request.requestAssignee.forEach(o => {
        this.allHrMember.splice(this.allHrMember.findIndex(p => +p.id === +o.assignee.id), 1);
      });
    }
  }

  openDetailAssignMember(request) {
    this.createFormAssignee();
    this.dynamicRequest = request;
    this.allHrMember = this.allFoundHrMember.slice(0);
    this.items = this.form2.get('items') as FormArray;
    for (const ra of this.dynamicRequest.requestAssignee) {
      this.items.push(this.createItem(ra.id, ra.assignee.id, ra.numberOfCandidate));
    }
    this.updateSelectBoxFormArray();
  }

  closeAssignMember(request) {
    this.dynamicRequest = request;
    this.createFormAssignee();
  }

  updateSelectBoxFormArray() {
    for (let i = 0; i < this.items.length; i++) {
      this.allHrMemberComboBox[i] = this.allHrMember.slice(0);
    }
    let userId = 0;
    for (let i = 0; i < this.items.length; i++) {
      userId = parseInt(this.form2.get(['items', i, 'requestAssignee']).value, 10);
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

  createItem(id?, assigneeId?, number?): FormGroup {
    return this.fb.group({
      id,
      requestAssignee: new FormControl(assigneeId, [
        Validators.required
      ]),
      number: new FormControl(number, [
        Validators.required,
        Validators.min(1)
      ]),
    });
  }

  addItem(id, assigneeId?, number?): void {
    this.items = this.form2.get('items') as FormArray;
    this.items.push(this.createItem(id, assigneeId, number));
    this.updateSelectBoxFormArray();
  }

  reqAssigneeModalChange(value, index) {
    this.updateSelectBoxFormArray();
    for (let i = 0; i < this.items.length; i++) {
      if (i !== index) {
        for (let j = 0; j < this.allHrMemberComboBox[i].length; j++) {
          if (this.allHrMemberComboBox[i][j].id === parseInt(value, 10)) {
            this.allHrMemberComboBox[i].splice(j, 1);
          }
        }
      }
    }
  }

  initItems() {
    if (this.dynamicRequest) {
      this.items = this.form2.get('items') as FormArray;
      for (const ra of this.dynamicRequest.requestAssignee) {
        this.items.push(this.createItem(ra.assignee.id, ra.numberOfCandidate));
      }
    }
  }

  onModalSubmit() {
    Helpers.setLoading(true);
    this.dynamicRequest.requestAssignee = [];
    for (let i = 0; i < this.items.length; i++) {
      const ra: RequestAssignee = new RequestAssignee();
      ra.request = new Request(this.dynamicRequest.id);
      ra.assignee = new User(parseInt(this.form2.get(['items', i, 'requestAssignee']).value, 10));
      ra.numberOfCandidate = this.form2.get(['items', i, 'number']).value;
      this.dynamicRequest.requestAssignee.push(ra);
    }
    this.isAssignSuccess = false;
    this.subAssignMember = this.requestService.assign(this.dynamicRequest.requestAssignee, this.dynamicRequest.id)
      .subscribe((res: any) => {
        this.isAssignSuccess = true;
        Helpers.setLoading(false);
        this.dynamicRequest = undefined;
        this.getRequestss();
      }, err => {

      });
  }
  // update by nmanh
  private getRequestss() {
    Helpers.setLoading(true);
    this.subListRequest = this.requestService.filter(this.requestParams)
      .subscribe((page: Page<any>) => {
        this.requestPage = page;
        this.ngRedux.dispatch({
          type: REQUEST_FETCH_SUCCESS,
          payload: normalizeRequestArray(page.content)
        });
        this.listRequest = page.content;
        this.listRequest = this.convertRequest(page.content);
        Helpers.setLoading(false);
        if (this.listRequest.length === 0) {
          this.resultMessage = 'No requests found!';
        } else {
          // window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
        }
      }, err => {
        this.resultMessage = err.error;
      });
  }

  onChangeTarget(requestAssignee) {
    if (this.isHrManager) {
      this.dynamicRequestAssignee = requestAssignee;
      $('#modal-change-target').modal({ show: true });
    }
  }
  closeModalChangeTarget() {
    if (this.isHrManager) {
      this.dynamicRequestAssignee = undefined;
      $('#modal-change-target').modal('toggle');
    }
  }
  validateNewTarget(event: string) {
    if (event.trim() === '') {
      this.errorTarget = true;
    } else {
      this.errorTarget = false;
    }
  }
  onNewTarget(newTarget: number) {
    this.response.isSubmitting = true;
    this.dynamicRequestAssignee.numberOfCandidate = +newTarget;
    Helpers.setLoading(true);
    this.subChangeTarget = this.requestService.changeTarget(this.dynamicRequestAssignee)
      .subscribe((response: RequestAssignee) => {
        if (response.numberOfCandidate === +newTarget) {
          this.response.isSuccess = true;
          this.response.isError = false;
          this.response.message = 'This target has been changed successful';
          setTimeout(() => {
            Helpers.setLoading(false);
            this.response.isSubmitting = false;
            $('#modal-change-target').modal('toggle');
            this.dynamicRequestAssignee = undefined;
            this.getRequests();
            this.response.message = '';
          }, 2000);
        }
      }, err => {
        this.response.isSubmitting = false;
        this.response.isSuccess = false;
        this.response.isError = true;
        this.response.message = err.error;
        Helpers.setLoading(false);
      });
  }

  ngAfterViewInit(): void {
    $('#m_aside_left_minimize_toggle').click();
    this._scriptLoaderService.load('app-home-main', './assets/app/js/home-js.js');
  }

  rejected() {
    this.getRequests();
  }

  closed() {
    this.getRequests();
  }
  publishRequest(request) {
    this.dynamicRequest = request;
    $('#modal-publish-request').modal({ show: true });
  }
  onPublistRequest() {
    Helpers.setLoading(true);
    this.response.isSubmitting = true;
    this.subPublicRequestParams = this.requestService.publishRequest({ requestId: +this.dynamicRequest.id })
      .subscribe(response => {
        this.response.isSuccess = true;
        if (response) {
          this.response.message = 'This request has been published successful';
        } else {
          this.response.message = 'We cannot publish this request, because it`s published before';
        }
        Helpers.setLoading(false);
        this.response.isSubmitting = false;
      }, error => {
        Helpers.setLoading(false);
        this.response.isSubmitting = false;
        this.response.isSuccess = true;
        this.response.message = 'Sorry, the server is not responsding';
      })
  };

  onResetResponse() {
    this.dynamicRequest = undefined;
    this.response = {
      isSubmitting: false,
      isError: false,
      isSuccess: false,
      message: ''
    };
  }
  ngOnDestroy(): void {
    if (this.subListRequest) {
      this.subListRequest.unsubscribe();
    }
    if (this.subListRequestStatus) {
      this.subListRequestStatus.unsubscribe();
    }
    if (this.subListDepartment) {
      this.subListDepartment.unsubscribe();
    }
    if (this.subListPriority) {
      this.subListPriority.unsubscribe();
    }
    if (this.subListUser) {
      this.subListUser.unsubscribe();
    }
    if (this.subSubmitRequest) {
      this.subSubmitRequest.unsubscribe();
    }
    if (this.subListHrMember) {
      this.subListHrMember.unsubscribe();
    }

    if (this.subApproveRequest) {
      this.subApproveRequest.unsubscribe();
    }
    if (this.subAssignMember) {
      this.subAssignMember.unsubscribe();
    }
    if (this.subChangeTarget) {
      this.subChangeTarget.unsubscribe();
    }
    if (this.subListGroup) {
      this.subListGroup.unsubscribe();
    }
    if (this.subRequestParams) {
      this.subRequestParams.unsubscribe();
    }
    if (this.subPublicRequestParams)
      this.subPublicRequestParams.unsubscribe();
  }

}
