import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { GrowlerService, GrowlerMessageType } from '../growler/growler.service';
import { LoggerService } from '../services/logger.service';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'cm-navbar',
    templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit, OnDestroy {

    isCollapsed: boolean = false;
    loginLogoutText = 'Login';
    sub: Subscription = {} as Subscription;

    constructor(private router: Router,
        private authservice: MsalService,
        private growler: GrowlerService,
        private logger: LoggerService,
        private msalBroadcastService: MsalBroadcastService) { }

    ngOnInit() {
        this.sub = this.msalBroadcastService.inProgress$
            .pipe(
                filter((status: InteractionStatus) => status === InteractionStatus.None)
            )
            .subscribe(() => {
                this.setLoginLogoutText();
            });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    loginOrOut() {
        const isAuthenticated = this.authservice.instance.getAllAccounts().length > 0;
        if (isAuthenticated) {
            this.authservice.logout()
                .subscribe(() => {
                    this.setLoginLogoutText();
                    this.growler.growl('Logged Out', GrowlerMessageType.Info);
                    this.router.navigate(['/customers']);
                    return;
                },
                    (err: any) => this.logger.log(err));
        }
        this.redirectToLogin();
    }

    redirectToLogin() {
        this.router.navigate(['/login']);
    }

    setLoginLogoutText() {
        this.loginLogoutText = (this.authservice.instance.getAllAccounts().length > 0) ? 'Logout' : 'Login';
    }

}
