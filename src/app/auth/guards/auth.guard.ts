import { IdentityService } from './../../core/services/identity.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private identityService: IdentityService
    ) { }

    canActivate() {
        if (this.identityService.isLoggedIn()) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page
        this.router.navigate(['/auth/login']);
        return false;
    }
}