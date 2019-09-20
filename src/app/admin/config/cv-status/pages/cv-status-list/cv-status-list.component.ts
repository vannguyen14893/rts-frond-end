import { Component, OnInit, OnDestroy } from '@angular/core';
import { CvStatus } from '../../../../../model/cv-status.class';
import { CONFIG } from '../../../../../shared/constants/configuration.constant';
import { Subscription } from 'rxjs/Subscription';
import { CvStatusService } from '../../service/cv-status.service';
import { NavigationService } from '../../../../../core/services/navigation.service';
import { SortService } from '../../../../../core/services/sort.service';
import { sortByProperty } from '../../../../../shared/helpers/data.helper';

declare var $:any;

@Component({
  selector: 'app-cv-status-list',
  templateUrl: './cv-status-list.component.html',
  styleUrls: ['./cv-status-list.component.css']
})

export class CvStatusListComponent implements OnInit, OnDestroy {
  
  listCvStatus: CvStatus[];

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

  subListCvStatus: Subscription;
  subSortService: Subscription;

  oldCvStatus: CvStatus;

  constructor(
    private cvStatusService: CvStatusService,
    private navigationService: NavigationService,
    private sortService: SortService
  ) { }

  ngOnInit() {
    this.getListCvStatus();
    $('#modal_update_cvStatus').on('hidden.bs.modal', function (e) {
      this.buttonClicked = false;
    });
    this.subSortService = this.sortService.columnSorted$.subscribe(colName => {
      this.sort(colName);
    });
  }

  getListCvStatus() {
    this.subListCvStatus = this.cvStatusService.findAll(this.params)
      .subscribe(response => {
        this.listCvStatus = response.content;
        this.requestPage = response;
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      });
  }

  openModal() {
    $('#modal_add_cvStatus').modal({show: true, backdrop: 'static'});
  }
  cvStatusSubmitted(event) {
    if (event === 'success') {
      this.params.page = 0;
      // reload request list
      this.getListCvStatus();
      // close modal
      $('#modal_add_cvStatus').modal('toggle');
    }
  }

  cvStatusUpdated(event) {
    if (event === 'success') {
      this.params.page = 0;
      // reload request list
      this.getListCvStatus();
      // close modal
      $('#modal_update_cvStatus').modal('toggle');
    }
  }

  onDetail(cvStatus) {
    this.oldCvStatus = cvStatus;
    this.buttonClicked = true;
    this.cvStatusService.setCvStatus(JSON.parse(JSON.stringify(cvStatus)));
    $('#modal_update_cvStatus').modal('show');  
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
    this.getListCvStatus();
  }

  first() {
    if (!this.requestPage.first) {
      this.params.page = 0;
      this.getListCvStatus();
    }
  }

  prev() {
    if (!this.requestPage.first) {
      this.params.page = this.requestPage.number - 1;
      this.getListCvStatus();
    }

  }

  next() {
    if (!this.requestPage.last) {
      this.params.page = this.requestPage.number + 1;
      this.getListCvStatus();
    }
  }

  last() {
    if (!this.requestPage.last) {
      this.params.page = this.requestPage.totalPages - 1;      
      this.getListCvStatus();
    }
  }

  navCvStatusList() {
    this.navigationService.navCvStatusList();
  }

  ngOnDestroy() {
    if (this.subSortService) {
      this.subSortService.unsubscribe();
    }
    if (this.subListCvStatus) {
      this.subListCvStatus.unsubscribe();
    }
  }
}
