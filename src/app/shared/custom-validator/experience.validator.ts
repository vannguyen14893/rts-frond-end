import { ExperienceService } from '../../admin/config/experience/service/experience.service';
import { AbstractControl } from "@angular/forms";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export class ExperienceValidator {

  static shouldBeUnique(experienceService: ExperienceService) {
    return (control: AbstractControl) => {
      if (control.value.trim()  !== '') {
        return experienceService.findByTitle({ title: control.value })
          .map(experience => {
            return (!experience) ? null : { shouldBeUnique: true };
          });
      }
    };
  }

}