import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'round'
})
export class RoundPipe implements PipeTransform {

  transform(value: any, args?: number): any {
    if (!value) return 0;
    let precision = 1;
    if (args) {
      precision = args;
    }
    console.log('input', value);
    console.log('args', args);
    console.log('presision', precision);
    console.log('return value', parseFloat(value).toFixed(precision));

    return parseFloat(value).toFixed(precision);
  }

}
