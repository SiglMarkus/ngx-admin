import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {RoleCheckService} from '../../../../vulangu/frontend/src/app/services/role-check/role-check.service';
import {AuthenticationService} from '../../../../vulangu/frontend/src/app/services/authentication/authentification.service';

/***
 * This guard checks if the current logged in user has a role, which can access routes
 */
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(public role: RoleCheckService, public auth: AuthenticationService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const softwareType: number[] = route.data.softwareType;
    if (this.role.isAllowed(softwareType)) {
      return true;
    }

    this.auth.logout();
    return false;
  }

}
