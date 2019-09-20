import { RecruitmentType } from './../../model/recruitment-type.class';
import { AbstractControl, ValidatorFn, ValidationErrors } from "@angular/forms";
import Utils from "../helpers/util";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { RecruitmentTypeService } from '../../admin/config/recruitment-type/service/recruitment-type.service';

export class RecruitmentTypeValidator {

  static shouldBeUnique(recruitmentTypeService: RecruitmentTypeService) {
    return (control: AbstractControl) => {
      if (control.value.trim() !== '') {
        return recruitmentTypeService.findByTitle({ title: control.value })
          .map(recruitmentType => {
            return (!recruitmentType) ? null : { shouldBeUnique: true };
          });
      }

    };
  }

}