import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { SortService } from './../../../core/services/sort.service';

@Component({
  selector: '[sortable-column]',
  templateUrl: './sortable-column.component.html',
  styleUrls: ['./sortable-column.component.css']
})
export class SortableColumnComponent implements OnInit, OnDestroy {
  private currentSortColumn = '';
  columnSortedSubscription: Subscription;
  constructor(
    private sortService: SortService
  ) { }

    // tslint:disable-next-line:no-input-rename
    @Input('sortable-column')
    columnName: string;

    // tslint:disable-next-line:no-input-rename
    @Input('sort-direction')
    sortDirection = '';

    @HostListener('click')
    sort() {
        this.sortDirection = (this.sortDirection === '') ? 'asc' : (this.sortDirection === 'asc') ? 'desc' : '';
        this.sortService.columnSorted(this.columnName.trim());
    }

    ngOnInit() {
      // subscribe to sort changes so we can react when other columns are sorted
      this.columnSortedSubscription = this.sortService.columnSorted$.subscribe(colName => {
        // reset this column's sort direction to hide the sort icons
        if (this.columnName !== colName) {
          this.sortDirection = '';
        }
      });
    }

    ngOnDestroy() {
      this.columnSortedSubscription.unsubscribe();
    }

}
