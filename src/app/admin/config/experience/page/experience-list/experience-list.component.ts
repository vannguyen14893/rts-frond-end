import { Component, OnInit } from '@angular/core';
import { Experience } from '../../../../../model/experience.class';
import { CONFIG } from '../../../../../shared/constants/configuration.constant';
import { Subscription } from 'rxjs/Subscription';
import { ExperienceService } from '../../service/experience.service';
import { NavigationService } from '../../../../../core/services/navigation.service';
import { SortService } from '../../../../../core/services/sort.service';
import { sortByProperty } from '../../../../../shared/helpers/data.helper';

declare var $: any;
@Component({
  selector: 'app-experience-list',
  templateUrl: './experience-list.component.html',
  styleUrls: ['./experience-list.component.css']
})
export class ExperienceListComponent implements OnInit {


  listExperience: Experience[];

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

  subListExperience: Subscription;
  subSortService: Subscription;

  oldExperience: Experience;
  
  constructor(
    private experienceService: ExperienceService,
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
    this.subListExperience = this.experienceService.findAll(this.params)
      .subscribe(response => {
        this.listExperience = response.content;
        this.requestPage = response;
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      });
  }

  openModal() {
    $('#modal_add').modal({show: true, backdrop: 'static'});
  }
  experienceSubmitted(event) {
    if (event === 'success') {
      this.params.page = 0;
      // reload request list
      this.getList();
      // close modal
      $('#modal_add').modal('toggle');
    }
  }

  experienceUpdated(event) {
    if (event === 'success') {
      this.params.page = 0;
      // reload request list
      this.getList();
      // close modal
      $('#modal_update').modal('toggle');
    }
  }

  onDetail(experience) {
    this.oldExperience = experience;
    this.buttonClicked = true;
    this.experienceService.setExperience(JSON.parse(JSON.stringify(experience)));
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
