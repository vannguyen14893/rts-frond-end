import { CandidateStatus } from './../../model/candidate-status.class';
import { AbstractControl, ValidatorFn, ValidationErrors } from "@angular/forms";
import Utils from "../helpers/util";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { CandidateStatusService } from '../../admin/config/candidate-status/service/candidate-status.service';

export class CandidateStatusValidator {

  static shouldBeUnique(candidateStatusService: CandidateStatusService) {
    return (control: AbstractControl) => {
      if (control.value.trim() !== '') {
        return candidateStatusService.findByTitle({ title: control.value })
          .map(candidateStatus => {
            return (!candidateStatus) ? null : { shouldBeUnique: true };
          });
      }

    };
  }

}