import { RequestStatus } from './../../model/request-status.class';
import { AbstractControl, ValidatorFn, ValidationErrors } from "@angular/forms";
import Utils from "../helpers/util";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { RequestStatusService } from '../../admin/config/request-status/service/request-status.service';

export class RequestStatusValidator {

  static shouldBeUnique(requestStatusService: RequestStatusService) {
    return (control: AbstractControl) => {
      if (control.value.trim() !== '') {
        return requestStatusService.findByTitle({ title: control.value })
          .map(requestStatus => {
            return (!requestStatus) ? null : { shouldBeUnique: true };
          });
      }

    };
  }

}