import { SkillService } from "../../admin/config/skill/services/skill.service";
import { AbstractControl } from "@angular/forms";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export class SkillValidator {

  static shouldBeUnique(skillService: SkillService) {
    return (control: AbstractControl) => {
      if (control.value.trim() !== '') {
        return skillService.findByTitle({ title: control.value })
          .map(skill => {
            return (!skill) ? null : { shouldBeUnique: true };
          });
      }
    };
  }

}