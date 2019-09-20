import { ProjectService } from "../../admin/config/project/service/project.service";
import { AbstractControl } from "@angular/forms";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export class ProjectValidator {

  static shouldBeUnique(projectService: ProjectService) {
    return (control: AbstractControl) => {
      if (control.value.trim() !== '') {
        return projectService.findByTitle({ title: control.value })
          .map(project => {
            return (!project) ? null : { shouldBeUnique: true };
          });
      }
    };
  }

}