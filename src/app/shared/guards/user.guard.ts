import { IdentityService } from '../../core/services/identity.service';
import { NavigationService } from '../../core/services/navigation.service';
import { LOCAL_STORAGE } from './../constants/local-storage.constant';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private navigationService: NavigationService,
    private identityService: IdentityService
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.identityService.isLoggedIn()) {
      return true;
    } else {
      this.navigationService.navLogin();
      return false;
    }
  }
}
