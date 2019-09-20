import { LocalStorageService } from './../../core/services/local-storage.service';
import { User } from './../../model/user.class';
import { IdentityService } from '../../core/services/identity.service';
import { LOCAL_STORAGE } from './../../shared/constants/local-storage.constant';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScriptLoaderService } from '../../core/services/script-loader.service';
import { NavigationService } from '../../core/services/navigation.service';
import { IRootState } from './../../core/redux/root.store';
import { NgRedux } from 'ng2-redux';
import { LOGOUT } from '../../core/redux/root.action';
import { Notification } from '../../model/notification.class';
import { NotificationService } from './notification.service';
import { CANDIDATE_STATUS_CHANGE } from '../../core/redux/ui/request-center/request-center-ui.action';
import { REQUEST_SELECT } from '../../core/redux/app/request-center/request-center.action';
import { environment } from '../../../environments/environment';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import * as $ from 'jquery';
import { ActionCreatorService } from '../../core/services/action-creator.service';
import { API_URL } from '../../shared/constants/api.constant';
import { MAKE_CANDIDATE } from '../../core/redux/app/cv-list/action';

declare let mLayout: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  currentUser: User;
  notifications: Notification[];
  notificationSockets: Notification[];
  disabled: boolean;
  username: string;
  // permissions
  canViewUserList = false;
  canViewConfiguration = false;
  canViewRequestList = false;
  canViewCvList = false;
  canViewInterviewList = false;
  canViewReport = false;

  private stompClient;
    private serverUrl = environment.baseUrl + API_URL.SOCKET_HANDLER;
    setConnected(connected: boolean) {
      this.disabled = !connected;
   
      if (connected) {
        this.notificationSockets = [];
      }
    }
    initializeWebSocketConnection(){
      const ws = new SockJS(this.serverUrl);
      this.stompClient = Stomp.over(ws);
      this.stompClient.debug = null
      this.username = this.currentUser.username;
      const that = this;
      this.stompClient.connect({}, function(frame) {
        that.setConnected(true);
        that.stompClient.subscribe('/chat/'+that.username, function(message){
          that.pushNotification(JSON.parse(message.body))
          });
        });
      }

  constructor(
    private router: Router,
    private _script: ScriptLoaderService,
    private navigationService: NavigationService,
    private identityService: IdentityService,
    private localStorageService: LocalStorageService,
    private ngRedux: NgRedux<IRootState>,
    private notificationService: NotificationService,
    private ac: ActionCreatorService,
  ) { }

  ngOnInit() {
    this.currentUser = this.identityService.getCurrentUser();
    // set permissions
    this.canViewConfiguration = this.currentUser.permission.viewPositionList
      || this.currentUser.permission.viewPriorityList
      || this.currentUser.permission.viewProjectList
      || this.currentUser.permission.viewDepartmentList
      || this.currentUser.permission.viewRecruitmentTypeList
      || this.currentUser.permission.viewExperienceList
      || this.currentUser.permission.viewSkillList;
    this.canViewCvList = this.currentUser.permission.viewCvList;
    this.canViewInterviewList = this.currentUser.permission.viewInterviewList;
    this.canViewReport = this.currentUser.permission.viewReport;
    this.canViewRequestList = this.currentUser.permission.viewRequestList;
    this.canViewUserList = this.currentUser.permission.viewUserList;

    this.localStorageService.storageSubject.subscribe(next => {
      this.currentUser = this.identityService.getCurrentUser();
    });
    this.notificationService.getNotifications(this.currentUser.id).subscribe( response => {
      this.notifications = response;
      this.ngRedux.dispatch({
        type: CANDIDATE_STATUS_CHANGE,
        payload: status
      });
    });
    this.initializeWebSocketConnection();
  }

  clearReduxStore() {
    this.ngRedux.dispatch({
      type: LOGOUT,
      payload: null,
    });
  }

  resetCurrentRequest() {
    this.ngRedux.dispatch({
      type: MAKE_CANDIDATE,
      payload: null
    });
  }

  logout() {
    // clear token remove user from local storage to log user out
    this.localStorageService.removeItem(LOCAL_STORAGE.CURRENT_USER);
    this.localStorageService.removeItem(LOCAL_STORAGE.TOKENS);
    this.navigationService.navLogin();
    this.clearReduxStore();
  }

  ngAfterViewInit() {
    this._script.load('app-header',
    'assets/demo/default/custom/header/actions.js').then(() => {
      });
      mLayout.initHeader();

  }

  navRequestCreate() {
    this.navigationService.navRequestCreate();
  }
  navCandidateCreate() {
    this.navigationService.navCandidateCreate();
  }
  navCvCreate() {
    this.navigationService.navCvCreate();
  }
  navInterviewCreate() {
    this.navigationService.navInterviewCreate();
  }
  navMyProfile() {
    this.navigationService.navMyProfile();
  }
  navRequestList() {
    this.navigationService.navHomepage();
  }
  navInterviewList() {
    this.navigationService.navInterviewList();
  }
  navReport() {
    this.navigationService.navReportList();
  }
  navCvList() {
    this.resetCurrentRequest();
    this.navigationService.navCvList();
  }
  navUser() {
    this.navigationService.navUserList();
  }
  navConfiguration() {
    this.navigationService.navConfig();
  }

  onCenterDetail(id) {
    this.ngRedux.dispatch({
      type: REQUEST_SELECT,
      payload: id
    });
    this.navigationService.navRequestCenterDetail(id);
  }

  navigateToRequestCenter (requestID, assigneeID, status, candidateId) {
    this.ac.setRequestCenterStatus(requestID, 0, status, 'Qualified', candidateId);
    this.navigationService.navRequestCenterDetail(requestID);
  }

  pushNotification(notification) {
    this.notificationSockets.splice(0, 0, notification);
  }

  navigateToRequestAssignee (requestID) {
    this.ac.setRequestCenterAssignee(requestID);
    this.navigationService.navRequestCenterDetail(requestID);
  }
}
