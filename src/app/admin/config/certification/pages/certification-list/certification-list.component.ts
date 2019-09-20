import { Component, OnInit } from '@angular/core';
import { Certification } from '../../../../../model/certification.class';
import { CONFIG } from '../../../../../shared/constants/configuration.constant';
import { Subscription } from 'rxjs/Subscription';
import { CertificationService } from '../../services/certification.service';
import { NavigationService } from '../../../../../core/services/navigation.service';
import { SortService } from '../../../../../core/services/sort.service';
import { sortByProperty } from '../../../../../shared/helpers/data.helper';

declare var $: any;
@Component({
  selector: 'app-certification-list',
  templateUrl: './certification-list.component.html',
  styleUrls: ['./certification-list.component.css']
})
export class CertificationListComponent implements OnInit {


  listCertification: Certification[];

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

  subListCertification: Subscription;
  subSortService: Subscription;

  oldCertification: Certification;

  constructor(
    private certificationService: CertificationService,
    private navigationService: NavigationService,
    private sortService: SortService
  ) { }

  ngOnInit() {
    this.getList();
    this.subSortService = this.sortService.columnSorted$.subscribe(colName => {
      this.sort(colName);
    });
  }

  getList() {
    this.subListCertification = this.certificationService.findAll()
      .subscribe(response => {
        this.listCertification = response.content;
        this.requestPage = response;
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      });
  }

  openModal() {
    $('#modal_add').modal({show: true, backdrop: 'static'});
  }
  certificationSubmitted(event) {
    if (event === 'success') {
      this.params.page = 0;
      // reload request list
      this.getList();
      // close modal
      $('#modal_add').modal('toggle');
    }
  }

  certificationUpdated(event) {
    if (event === 'success') {
      this.params.page = 0;
      // reload request list
      this.getList();
      // close modal
      $('#modal_update').modal('toggle');
    }
  }

  onDetail(certification) {
    this.oldCertification = certification;
    this.buttonClicked = true;
    this.certificationService.setCertification(JSON.parse(JSON.stringify(certification)));
    $('#modal_update').modal('show');
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
    this.getList();
  }

  first() {
    if (!this.requestPage.first) {
      this.params.page = 0;
      this.getList();
    }
  }

  prev() {
    if (!this.requestPage.first) {
      this.params.page = this.requestPage.number - 1;
      this.getList();
    }

  }

  next() {
    if (!this.requestPage.last) {
      this.params.page = this.requestPage.number + 1;
      this.getList();
    }
  }

  last() {
    if (!this.requestPage.last) {
      this.params.page = this.requestPage.totalPages - 1;
      this.getList();
    }
  }

}
