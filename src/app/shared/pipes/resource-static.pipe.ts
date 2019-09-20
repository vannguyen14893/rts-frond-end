import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'resourceStatic'
})
export class ResourceStaticPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return '';
    }
    if (value && (String(value).startsWith('http://') || String(value).startsWith('https://'))) {
      return value;
    }
    return environment.baseUrl + '/static/' + value;
  }

}
