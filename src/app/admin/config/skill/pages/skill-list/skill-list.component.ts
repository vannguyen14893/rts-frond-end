import { Skill } from '../../../../../model/skill.class';
import { Component, OnInit } from '@angular/core';
import { CONFIG } from '../../../../../shared/constants/configuration.constant';
import { Subscription } from 'rxjs/Subscription';
import { SkillService } from '../../services/skill.service';
import { NavigationService } from '../../../../../core/services/navigation.service';
import { SortService } from '../../../../../core/services/sort.service';
import { sortByProperty } from '../../../../../shared/helpers/data.helper';

declare var $: any;
@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrls: ['./skill-list.component.css']
})
export class SkillListComponent implements OnInit {

  listSkill: Skill[];

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

  subListSkill: Subscription;
  subSortService: Subscription;

  oldSkill: Skill;

  constructor(
    private skillService: SkillService,
    private navigationService: NavigationService,
    private sortService: SortService
  ) { }

  ngOnInit() {
    this.getListSkill();
    $('#modal_update_skill').on('hidden.bs.modal', function (e) {
      this.buttonClicked = false;
    });
    this.subSortService = this.sortService.columnSorted$.subscribe(colName => {
      this.sort(colName);
    });
  }

  getListSkill() {
    this.subListSkill = this.skillService.findAll(this.params)
      .subscribe(response => {
        this.listSkill = response.content;
        this.requestPage = response;
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      });
  }

  openModal() {
    $('#modal_add_skill').modal({show: true, backdrop: 'static'});
  }
  skillSubmitted(event) {
    if (event === 'success') {
      this.params.page = 0;
      // reload request list
      this.getListSkill();
      // close modal
      $('#modal_add_skill').modal('toggle');
    }
  }

  skillUpdated(event) {
    if (event === 'success') {
      this.params.page = 0;
      // reload request list
      this.getListSkill();
      // close modal
      $('#modal_update_skill').modal('toggle');
    }
  }

  onDetail(skill) {
    this.oldSkill = skill;
    this.buttonClicked = true;
    this.skillService.setSkill(JSON.parse(JSON.stringify(skill)));
    $('#modal_update_skill').modal('show');  
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
    this.getListSkill();
  }

  first() {
    if (!this.requestPage.first) {
      this.params.page = 0;
      this.getListSkill();
    }
  }

  prev() {
    if (!this.requestPage.first) {
      this.params.page = this.requestPage.number - 1;
      this.getListSkill();
    }

  }

  next() {
    if (!this.requestPage.last) {
      this.params.page = this.requestPage.number + 1;
      this.getListSkill();
    }
  }

  last() {
    if (!this.requestPage.last) {
      this.params.page = this.requestPage.totalPages - 1;      
      this.getListSkill();
    }
  }

  navSkillList() {
    this.navigationService.navDepartmentList();
  }

  ngOnDestroy() {
    if (this.subSortService) {
      this.subSortService.unsubscribe();
    }
    if (this.subListSkill) {
      this.subListSkill.unsubscribe();
    }
  }
}
