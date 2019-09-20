import { Component, OnInit, OnDestroy } from "@angular/core";
import { CONFIG } from "../../../../../shared/constants/configuration.constant";
import { Subscription } from "rxjs/Subscription";
import { PositionService } from "../../services/position.service";
import { NavigationService } from "../../../../../core/services/navigation.service";
import { SortService } from "../../../../../core/services/sort.service";
import { sortByProperty } from "../../../../../shared/helpers/data.helper";

declare var $: any;
@Component({
  selector: 'app-position-list',
  templateUrl: './position-list.component.html',
  styleUrls: ['./position-list.component.css']
})
export class PositionListComponent implements OnInit, OnDestroy {

  listPosition: Position[];

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

  subListPosition: Subscription;
  subSortService: Subscription;

  oldPosition: Position;

  constructor(
    private positionService: PositionService,
    private navigationService: NavigationService,
    private sortService: SortService
  ) { }

  ngOnInit() {
    this.getListPosition();
    $('#modal_update_position').on('hidden.bs.modal', function (e) {
      this.buttonClicked = false;
    });
    this.subSortService = this.sortService.columnSorted$.subscribe(colName => {
      this.sort(colName);
    });
  }

  getListPosition() {
    this.subListPosition = this.positionService.findAll(this.params)
      .subscribe(response => {
        this.listPosition = response.content;
        this.requestPage = response;
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      });
  }

  openModal() {
    $('#modal_add_position').modal({ show: true, backdrop: 'static' });
  }
  positionSubmitted(event) {
    if (event === 'success') {
      this.params.page = 0;
      // reload request list
      this.getListPosition();
      // close modal
      $('#modal_add_position').modal('toggle');
    }
  }

  positionUpdated(event) {
    if (event === 'success') {
      this.params.page = 0;
      // reload request list
      this.getListPosition();
      // close modal
      $('#modal_update_position').modal('toggle');
    }
  }

  onDetail(position) {
    this.oldPosition = position;
    this.buttonClicked = true;
    this.positionService.setPosition(JSON.parse(JSON.stringify(position)));
    $('#modal_update_position').modal('show');
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
    this.getListPosition();
  }

  first() {
    if (!this.requestPage.first) {
      this.params.page = 0;
      this.getListPosition();
    }
  }

  prev() {
    if (!this.requestPage.first) {
      this.params.page = this.requestPage.number - 1;
      this.getListPosition();
    }

  }

  next() {
    if (!this.requestPage.last) {
      this.params.page = this.requestPage.number + 1;
      this.getListPosition();
    }
  }

  last() {
    if (!this.requestPage.last) {
      this.params.page = this.requestPage.totalPages - 1;
      this.getListPosition();
    }
  }

  navPositionList() {
    this.navigationService.navPositionList();
  }

  ngOnDestroy() {
    if (this.subSortService) {
      this.subSortService.unsubscribe();
    }
    if (this.subListPosition) {
      this.subListPosition.unsubscribe();
    }
  }

}
