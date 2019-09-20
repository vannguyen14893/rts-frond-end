import { IRootState } from '../../../../core/redux/root.store';
import { ModalMessage } from '../../../../model/modal-message.class';
import { CONFIG } from '../../../../shared/constants/configuration.constant';
import { Observable } from 'rxjs/Observable';
import { select, NgRedux } from 'ng2-redux';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RequestCenterService } from '../../../services/request-center.service';
import { User } from '../../../../model/user.class';
import { Interview } from '../../../../model/interview.class';
import { denormalizeInterview, denormalizeUserArray, normalizeInterview } from '../../../../core/redux/domain/domain.normalization';
import { INTERVIEW_UPDATE } from '../../../../core/redux/domain/domain.action';

@Component({
  selector: 'app-add-interviewer',
  templateUrl: './add-interviewer.component.html',
  styleUrls: ['./add-interviewer.component.css']
})
export class AddInterviewerComponent implements OnInit, AfterViewInit {
  @select((s: IRootState) => s.appStore.requestCenterStore.currentInterviewId) currentInterviewId$;
  @select((s: IRootState) => s.domainStore.interviews) interviews$;
  @select((s: IRootState) => s.domainStore.users) users$;
  @select((s: IRootState) => s.domainStore.userIds) userIds$;

  allUsers: User[] = [];
  sourceInterviewers: User[];
  searchResults: User[] = [];
  searchInput: string;
  addedInterviewers: User[] = [];
  currentInterview: Interview;

  message: ModalMessage;

  constructor(
    private requestService: RequestCenterService,
    private ngRedux: NgRedux<IRootState>
  ) { }

  ngOnInit() {
    // Lấy interview hiện tại
    Observable.combineLatest(
      this.interviews$,
      this.currentInterviewId$,
      this.userIds$
    ).subscribe(res => {
      if (res[1] !== 0) {
        this.currentInterview = denormalizeInterview(res[0][res[1]], this.ngRedux.getState()['domainStore']);
      }
      if (res[2].length > 0) {
        this.allUsers = denormalizeUserArray(res[2], this.ngRedux.getState()['domainStore']);
        this.sourceInterviewers = this.allUsers.filter(u => this.currentInterview.userCollection.findIndex(u2 => u2.id === u.id) < 0);
        this.searchResults = this.sourceInterviewers;
      }
    });
  }

  ngAfterViewInit() {
    window.document.getElementById('search-input').focus();
  }

  search() {
    this.searchResults = this.sourceInterviewers.filter(c => c.fullName.toLowerCase().search(this.searchInput.trim().toLowerCase()) > -1
      || c.username.toLowerCase().search(this.searchInput.trim().toLowerCase()) > -1);
  }

  checkUser(user: User) {
    user.selected = !user.selected;
    const index = this.addedInterviewers.findIndex(u => u.id === user.id);
    index > -1 ? this.addedInterviewers.splice(index, 1) : this.addedInterviewers.push(user);
  }

  submit() {
    if (this.addedInterviewers && this.addedInterviewers.length > 0) {
      const userIds = [];
      this.addedInterviewers.map((user: User) => {
        userIds.push(user.id);
      });
      this.requestService.addInterviewers(this.currentInterview.id, userIds).subscribe(res => {
        // TODO: Update current candidate and current interview on store
        this.currentInterview.userCollection.push(...this.addedInterviewers);
        this.ngRedux.dispatch({
          type: INTERVIEW_UPDATE,
          payload: normalizeInterview(this.currentInterview)
        });
        this.requestService.closeModal();
      }, err => {
        console.log(err);
        this.message.type = 'error';
        switch (err.status) {
          case 400:
            this.message.message = 'Interviews conflicted';
            break;
          case 500:
            this.message.message = 'Internal Server Error.';
            break;
          default:
            break;
        }
      });
    }
  }

}
