import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { IdentityService } from '../../core/services/identity.service';
import { NavigationService } from '../../core/services/navigation.service';

@Injectable()
export class DuMemberGuard implements CanActivate {
  constructor(
    private identityService: IdentityService,
    private navigationService: NavigationService
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.identityService.isDuMember()) {
      return true;
    } else {
      this.navigationService.navErrorUnauthorized();
      return false;
    }
  }
}
