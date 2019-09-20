import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'length'
})
export class LengthPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value || value === null) {
      return 0;
    }
    return value.length;
  }

}
