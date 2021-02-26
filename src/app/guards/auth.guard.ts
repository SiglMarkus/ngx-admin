import { Injectable } from '@angular/core';
import {CanActivate, CanLoad, Router} from '@angular/router';
import { AuthenticationService } from '../../../../vulangu/frontend/src/app/services/authentication/authentification.service';
import {Observable} from 'rxjs';


/***
 * Guard which offers the 'canActivate' and 'canLoad' method which checks our authentication service
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(public auth: AuthenticationService, public router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.isAuthenticated()) {
      return true;
    }

    return false;
  }

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.isAuthenticated()) {
      return true;
    }

    return false;
  }
}
