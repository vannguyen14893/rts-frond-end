import { CvStatus } from './../../model/cv-status.class';
import { AbstractControl, ValidatorFn, ValidationErrors } from "@angular/forms";
import Utils from "../helpers/util";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { CvStatusService } from '../../admin/config/cv-status/service/cv-status.service';

export class CvStatusValidator {

  static shouldBeUnique(cvStatusService: CvStatusService) {
    return (control: AbstractControl) => {
      if (control.value.trim() !== '') {
        return cvStatusService.findByTitle({ title: control.value })
          .map(cvStatus => {
            return (!cvStatus) ? null : { shouldBeUnique: true };
          });
      }

    };
  }

}