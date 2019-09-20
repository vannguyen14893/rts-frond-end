import { environment } from './../../../environments/environment.prod';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resourcePublic'
})
export class ResourcePublicPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return '';
    }
    if (value && (String(value).startsWith('http://') || String(value).startsWith('https://'))) {
      return value;
    }
    return environment.baseUrl + '/public/' + value;
  }

}
