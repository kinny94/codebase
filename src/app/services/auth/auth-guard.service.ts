import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { Globals } from 'src/app/global';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    private globals: Globals) { }

    canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this.authService.user$.pipe(
        map( user => {
          if ( user ) {
            console.log(this.globals.currentUser);
            return true;
          }
          this.router.navigate(['/']);
          return false;
        })
      );
    }
}
