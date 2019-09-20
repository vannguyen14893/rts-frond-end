import { Department } from './../../model/department.class';
import { AbstractControl, ValidatorFn, ValidationErrors } from "@angular/forms";
import Utils from "../helpers/util";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { DepartmentService } from "../../admin/config/department/service/department.service";

export class DepartmentValidator {

  static shouldBeUnique(departmentService: DepartmentService) {
    return (control: AbstractControl) => {
      if(control.value.trim() !== '') {
        return departmentService.findByTitle({title: control.value})
          .map(department => {
            return (!department) ? null : { shouldBeUnique: true };
          });
      }
      
    };
  }

}