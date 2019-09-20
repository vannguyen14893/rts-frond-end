import { OnDestroy, Component, OnInit } from "@angular/core";
import { RequestStatus } from "../../../../../model/request-status.class";
import { CONFIG } from "../../../../../shared/constants/configuration.constant";
import { Subscription } from "rxjs/Subscription";
import { RequestStatusService } from "../../service/request-status.service";
import { NavigationService } from "../../../../../core/services/navigation.service";
import { SortService } from "../../../../../core/services/sort.service";
import { sortByProperty } from "../../../../../shared/helpers/data.helper";

declare var $:any;

@Component({
  selector: 'app-request-status-list',
  templateUrl: './request-status-list.component.html',
  styleUrls: ['./request-status-list.component.css']
})
export class RequestStatusListComponent implements OnInit, OnDestroy {

  listRequestStatus: RequestStatus[];

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

  subListRequestStatus: Subscription;
  subSortService: Subscription;

  oldRequestStatus: RequestStatus;

  constructor(
    private requestStatusService: RequestStatusService,
    private navigationService: NavigationService,
    private sortService: SortService
  ) { }

  ngOnInit() {
    this.getListRequestStatus();
    $('#modal_update_requestStatus').on('hidden.bs.modal', function (e) {
      this.buttonClicked = false;
    });
    this.subSortService = this.sortService.columnSorted$.subscribe(colName => {
      this.sort(colName);
    });
  }

  getListRequestStatus() {
    this.subListRequestStatus = this.requestStatusService.findAll(this.params)
      .subscribe(response => {
        this.listRequestStatus = response.content;
        this.requestPage = response;
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      });
  }

  openModal() {
    $('#modal_add_requestStatus').modal({show: true, backdrop: 'static'});
  }
  requestStatusSubmitted(event) {
    if (event === 'success') {
      this.params.page = 0;
      // reload request list
      this.getListRequestStatus();
      // close modal
      $('#modal_add_requestStatus').modal('toggle');
    }
  }

  requestStatusUpdated(event) {
    if (event === 'success') {
      this.params.page = 0;
      // reload request list
      this.getListRequestStatus();
      // close modal
      $('#modal_update_requestStatus').modal('toggle');
    }
  }

  onDetail(requestStatus) {
    this.oldRequestStatus = requestStatus;
    this.buttonClicked = true;
    this.requestStatusService.setRequestStatus(JSON.parse(JSON.stringify(requestStatus)));
    $('#modal_update_requestStatus').modal('show');  
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
    this.getListRequestStatus();
  }

  first() {
    if (!this.requestPage.first) {
      this.params.page = 0;
      this.getListRequestStatus();
    }
  }

  prev() {
    if (!this.requestPage.first) {
      this.params.page = this.requestPage.number - 1;
      this.getListRequestStatus();
    }

  }

  next() {
    if (!this.requestPage.last) {
      this.params.page = this.requestPage.number + 1;
      this.getListRequestStatus();
    }
  }

  last() {
    if (!this.requestPage.last) {
      this.params.page = this.requestPage.totalPages - 1;      
      this.getListRequestStatus();
    }
  }

  navRequestStatusList() {
    this.navigationService.navRequestStatusList();
  }

  ngOnDestroy() {
    if (this.subSortService) {
      this.subSortService.unsubscribe();
    }
    if (this.subListRequestStatus) {
      this.subListRequestStatus.unsubscribe();
    }
  }

}
