import { PriorityService } from '../../admin/config/priority/service/priority.service';
import { AbstractControl } from "@angular/forms";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export class PriorityValidator {

  static shouldBeUnique(priorityService: PriorityService) {
    return (control: AbstractControl) => {
      if (control.value.trim() !== '') {
        return priorityService.findByTitle({ title: control.value })
          .map(priority => {
            return (!priority) ? null : { shouldBeUnique: true };
          });
      }
    };
  }

}