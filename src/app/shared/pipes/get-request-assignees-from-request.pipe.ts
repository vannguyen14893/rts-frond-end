import { Pipe, PipeTransform } from '@angular/core';
import { Request } from '../../model/request.class';

@Pipe({
  name: 'getAssignees'
})
export class GetRequestAssigneesFromRequestPipe implements PipeTransform {

  transform(value: Request, args?: any): any {
    if (!value || value === null) {
      return null;
    }
    return value.requestAssignee;
  }

}
