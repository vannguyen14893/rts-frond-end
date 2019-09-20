import { Position } from './../../model/position.class';
import { AbstractControl, ValidatorFn, ValidationErrors } from "@angular/forms";
import Utils from "../helpers/util";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { PositionService } from '../../admin/config/position/services/position.service';

export class PositionValidator {

  static shouldBeUnique(positionService: PositionService) {
    return (control: AbstractControl) => {
      if (control.value.trim() !== '') {
        return positionService.findByTitle({ title: control.value })
          .map(position => {
            return (!position) ? null : { shouldBeUnique: true };
          });
      }

    };
  }

}