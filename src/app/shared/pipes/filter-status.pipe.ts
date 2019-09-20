import { Pipe, PipeTransform } from '@angular/core';
import { Status } from '../../model/status.class';

@Pipe({
  name: 'filterStatus'
})
export class FilterStatusPipe implements PipeTransform {

  transform(value: Status[], excludedStatus: Status): any {
    console.log('=========pipe============', value, excludedStatus);
    if (!value || value === null || value === []) {
      return [];
    }
    const index = value.findIndex(s => s.id === excludedStatus.id);
    if (index > -1) {
      return value.splice(index, 1);
    }
    return value;
  }

}
