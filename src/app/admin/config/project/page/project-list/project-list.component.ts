import { Component, OnInit, OnDestroy } from "@angular/core";
import { Project } from "../../../../../model/project.class";
import { CONFIG } from "../../../../../shared/constants/configuration.constant";
import { Subscription } from "rxjs/Subscription";
import { ProjectService } from "../../service/project.service";
import { NavigationService } from "../../../../../core/services/navigation.service";
import { SortService } from "../../../../../core/services/sort.service";
import { sortByProperty } from "../../../../../shared/helpers/data.helper";


declare var $: any;
@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit, OnDestroy {

  listProject: Project[];

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

  subListProject: Subscription;
  subSortService: Subscription;

  oldProject: Project;

  constructor(
    private projectService: ProjectService,
    private navigationService: NavigationService,
    private sortService: SortService
  ) { }

  ngOnInit() {
    this.getList();
    this.subSortService = this.sortService.columnSorted$.subscribe(colName => {
      this.sort(colName);
    });
  }

  ngOnDestroy(): void {
  }

  getList() {
    this.subListProject = this.projectService.findAll(this.params)
      .subscribe(response => {
        this.listProject = response.content;
        this.requestPage = response;
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      });
  }

  openModal() {
    $('#modal_add_project').modal({ show: true, backdrop: 'static' });
  }
  projectSubmitted(event) {
    if (event === 'success') {
      this.params.page = 0;
      // reload request list
      this.getList();
      // close modal
      $('#modal_add_project').modal('toggle');
    }
  }

  projectUpdated(event) {
    if (event === 'success') {
      this.params.page = 0;
      // reload request list
      this.getList();
      // close modal
      $('#modal_update_project').modal('toggle');
    }
  }

  onDetail(project) {
    this.oldProject = project;
    this.buttonClicked = true;
    this.projectService.setProject(JSON.parse(JSON.stringify(project)));
    $('#modal_update_project').modal('show');
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

