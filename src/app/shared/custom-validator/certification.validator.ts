import { CertificationService } from '../../admin/config/certification/services/certification.service';
import { AbstractControl } from "@angular/forms";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export class CertificationValidator {

  static shouldBeUnique(certificationService: CertificationService) {
    return (control: AbstractControl) => {
      if (control.value.trim()  !== '') {
        return certificationService.findByTitle({ title: control.value })
          .map(certification => {
            return (!certification) ? null : { shouldBeUnique: true };
          });
      }
    };
  }

}
