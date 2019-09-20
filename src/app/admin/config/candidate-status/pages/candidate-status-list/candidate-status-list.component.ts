import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { CandidateStatus } from '../../../../../model/candidate-status.class';
import { CONFIG } from '../../../../../shared/constants/configuration.constant';
import { Subscription } from 'rxjs/Subscription';
import { CandidateStatusService } from '../../service/candidate-status.service';
import { NavigationService } from '../../../../../core/services/navigation.service';
import { SortService } from '../../../../../core/services/sort.service';
import { sortByProperty } from '../../../../../shared/helpers/data.helper';

declare var $:any;
@Component({
  selector: 'app-candidate-status-list',
  templateUrl: './candidate-status-list.component.html',
  styleUrls: ['./candidate-status-list.component.css']
})
export class CandidateStatusListComponent implements OnInit, OnDestroy {

  listCandidateStatus: CandidateStatus[];

  params = {
    page: 0,
    size: CONFIG.PAGE_SIZE,
    sort: 'id,desc'
  };

  requestPage;
  notFoundMessage = '';
  error = {
    isError: false,
    message: ''
  };

  sortDirection = 0;
  currentSortProperty = '';

  buttonClicked = false;

  subListCandidateStatus: Subscription;
  subSortService: Subscription;

  oldCandidateStatus: CandidateStatus;

  constructor(
    private candidateStatusService: CandidateStatusService,
    private navigationService: NavigationService,
    private sortService: SortService
  ) { }

  ngOnInit() {
    this.getListCandidateStatus();
    $('#modal_update_candidateStatus').on('hidden.bs.modal', function (e) {
      this.buttonClicked = false;
    });
    this.subSortService = this.sortService.columnSorted$.subscribe(colName => {
      this.sort(colName);
    });
  }

  getListCandidateStatus() {
    this.subListCandidateStatus = this.candidateStatusService.findAll(this.params)
      .subscribe(response => {
        this.listCandidateStatus = response.content;
        this.requestPage = response;
        if(this.requestPage){
          window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
        }
      });
  }

  openModal() {
    $('#modal_add_candidateStatus').modal({ show: true, backdrop: 'static' });
  }
  candidateStatusSubmitted(event) {
    if (event === 'success') {
      this.params.page = 0;
      // reload request list
      this.getListCandidateStatus();
      // close modal
      $('#modal_add_candidateStatus').modal('toggle');
    }
  }

  candidateStatusUpdated(event) {
    if (event === 'success') {
      this.params.page = 0;
      // reload request list
      this.getListCandidateStatus();
      // close modal
      $('#modal_update_candidateStatus').modal('toggle');
    }
  }

  onDetail(candidateStatus) {
    this.oldCandidateStatus = candidateStatus;
    this.buttonClicked = true;
    this.candidateStatusService.setCandidateStatus(JSON.parse(JSON.stringify(candidateStatus)));
    $('#modal_update_candidateStatus').modal('show');
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
    // sort server
    const currentSortParam = String(this.params.sort) || '';
    const splittedParams = currentSortParam.split(',');
    if (splittedParams[0] === this.currentSortProperty) {
      if (splittedParams.length > 1) {
        if (splittedParams[1] === 'desc') {
          this.params.sort = this.currentSortProperty + ',asc';
        } else if (splittedParams[1] === 'asc') {
          this.params.sort = 'id,desc';
        }
      }
    } else {
      this.params.sort = this.currentSortProperty + ',desc';
    }
    this.getListCandidateStatus();
  }

  first() {
    if (!this.requestPage.first) {
      this.params.page = 0;
      this.getListCandidateStatus();
    }
  }

  prev() {
    if (!this.requestPage.first) {
      this.params.page = this.requestPage.number - 1;
      this.getListCandidateStatus();
    }

  }

  next() {
    if (!this.requestPage.last) {
      this.params.page = this.requestPage.number + 1;
      this.getListCandidateStatus();
    }
  }

  last() {
    if (!this.requestPage.last) {
      this.params.page = this.requestPage.totalPages - 1;
      this.getListCandidateStatus();
    }
  }

  navCandidateStatusList() {
    this.navigationService.navCandidateStatusList();
  }

  ngOnDestroy() {
    if (this.subSortService) {
      this.subSortService.unsubscribe();
    }
    if (this.subListCandidateStatus) {
      this.subListCandidateStatus.unsubscribe();
    }
  }

}
