import { Component, OnInit, OnDestroy } from "@angular/core";
import { RecruitmentType } from "../../../../../model/recruitment-type.class";
import { CONFIG } from "../../../../../shared/constants/configuration.constant";
import { Subscription } from "rxjs/Subscription";
import { RecruitmentTypeService } from "../../service/recruitment-type.service";
import { NavigationService } from "../../../../../core/services/navigation.service";
import { SortService } from "../../../../../core/services/sort.service";
import { sortByProperty } from "../../../../../shared/helpers/data.helper";

declare var $: any;

@Component({
  selector: 'app-recruitment-type-list',
  templateUrl: './recruitment-type-list.component.html',
  styleUrls: ['./recruitment-type-list.component.css']
})
export class RecruitmentTypeListComponent implements OnInit, OnDestroy {
  listRecruitmentType: RecruitmentType[];

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

  subListRecruitmentType: Subscription;
  subSortService: Subscription;

  oldRecruitmentType: RecruitmentType;

  constructor(
    private recruitmentTypeService: RecruitmentTypeService,
    private navigationService: NavigationService,
    private sortService: SortService
  ) { }

  ngOnInit() {
    this.getListRecruitmentType();
    $('#modal_update_recruitmentType').on('hidden.bs.modal', function (e) {
      this.buttonClicked = false;
    });
    this.subSortService = this.sortService.columnSorted$.subscribe(colName => {
      this.sort(colName);
    });
  }

  getListRecruitmentType() {
    this.subListRecruitmentType = this.recruitmentTypeService.findAll(this.params)
      .subscribe(response => {
        this.listRecruitmentType = response.content;
        this.requestPage = response;
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      });
  }

  openModal() {
    $('#modal_add_recruitmentType').modal({ show: true, backdrop: 'static' });
  }
  recruitmentTypeSubmitted(event) {
    if (event === 'success') {
      this.params.page = 0;
      // reload request list
      this.getListRecruitmentType();
      // close modal
      $('#modal_add_recruitmentType').modal('toggle');
    }
  }

  recruitmentTypeUpdated(event) {
    if (event === 'success') {
      this.params.page = 0;
      // reload request list
      this.getListRecruitmentType();
      // close modal
      $('#modal_update_recruitmentType').modal('toggle');
    }
  }

  onDetail(recruitmentType) {
    this.oldRecruitmentType = recruitmentType;
    this.buttonClicked = true;
    this.recruitmentTypeService.setRecruitmentType(JSON.parse(JSON.stringify(recruitmentType)));
    $('#modal_update_recruitmentType').modal('show');
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
    this.getListRecruitmentType();
  }

  first() {
    if (!this.requestPage.first) {
      this.params.page = 0;
      this.getListRecruitmentType();
    }
  }

  prev() {
    if (!this.requestPage.first) {
      this.params.page = this.requestPage.number - 1;
      this.getListRecruitmentType();
    }

  }

  next() {
    if (!this.requestPage.last) {
      this.params.page = this.requestPage.number + 1;
      this.getListRecruitmentType();
    }
  }

  last() {
    if (!this.requestPage.last) {
      this.params.page = this.requestPage.totalPages - 1;
      this.getListRecruitmentType();
    }
  }

  navRecruitmentTypeList() {
    this.navigationService.navRecruitmentTypeList();
  }

  ngOnDestroy() {
    if (this.subSortService) {
      this.subSortService.unsubscribe();
    }
    if (this.subListRecruitmentType) {
      this.subListRecruitmentType.unsubscribe();
    }
  }
}
