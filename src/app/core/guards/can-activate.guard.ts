import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { filter, Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class CanActivateGuard implements CanActivate {

  constructor(private msalService: MsalService,
    private authService: AuthService,
    private router: Router,
    private msalBroadcastService: MsalBroadcastService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        switchMap(() => {
          if (this.msalService.instance.getAllAccounts().length > 0) {
            return of(true);
          }

          this.authService.redirectUrl = state.url;
          this.router.navigate(['/login']);
          return of(false);
        })
      );

    // Track URL user is trying to go to so we can send them there after logging in
    // this.authService.redirectUrl = state.url;
    // return false;
  }

}
