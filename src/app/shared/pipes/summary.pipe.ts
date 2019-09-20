import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'summary'
})
export class SummaryPipe implements PipeTransform {

  transform(value: string, limit?: number): any {
    if (!value)
      return null;
    let actualLimit = (limit) ? limit : 50;
    return (value.length <= actualLimit) ? value : value.substr(0, actualLimit) + ' . . .';
  }

}
