import { NavigationService } from '../../core/services/navigation.service';
import { IdentityService } from '../../core/services/identity.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DuLeadGuard implements CanActivate {
  constructor(
    private identityService: IdentityService,
    private navigationService: NavigationService
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (this.identityService.isDuLead() || this.identityService.isDuMember()) {
        return true;
      } else {
        this.navigationService.navErrorUnauthorized();
        return false;
      }
  }
}
