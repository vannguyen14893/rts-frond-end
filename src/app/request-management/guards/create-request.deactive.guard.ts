import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { RequestManagementCreateComponent } from '../pages/request-management-create/request-management-create.component';

@Injectable()
export class CreateRequestDeactiveGuard implements CanDeactivate <RequestManagementCreateComponent> {
  canDeactivate(component: RequestManagementCreateComponent): boolean {
    if (component.hasUnsavedData()) {
        return confirm('You have unsaved changes! If you leave, your changes will be lost.');
    }
    return true;
  }
}
