import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SortService {

  constructor() { }

  private sortedColumn = new Subject<string>();

  columnSorted$ = this.sortedColumn.asObservable();

  columnSorted(columnName: string) {
    return this.sortedColumn.next(columnName);
  }
}
