import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MsalBroadcastService, MsalGuard, MsalInterceptor, MsalModule, MsalService } from "@azure/msal-angular";
import { BrowserCacheLocation, InteractionType, PublicClientApplication } from "@azure/msal-browser";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { LoginModule } from './login/login.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  imports: [
    BrowserModule,
    LoginModule,          // Eager loaded since we may need to go here right away as browser loads based on route user enters
    AppRoutingModule,     // Main routes for application
    CoreModule,           // Singleton objects (services, components that are loaded only once, etc.)
    SharedModule,          // Shared (multi-instance) objects
    MsalModule.forRoot(new PublicClientApplication({ // MSAL Configuration
      auth: {
        clientId: "97130d1c-6508-4c22-a157-05e198225815",
        authority: "https://login.microsoftonline.com/M365x61791022.onmicrosoft.com",
        redirectUri: "http://localhost:8080/auth",
      },
      cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage,
        storeAuthStateInCookie: false, // set to true for IE 11
      },
      system: {
        loggerOptions: {
          loggerCallback: () => { },
          piiLoggingEnabled: false
        }
      }
    }), {
      interactionType: InteractionType.Redirect, // MSAL Guard Configuration
    }, {
      interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
      protectedResourceMap: new Map([
        ['https://graph.microsoft.com/v1.0/me', ['user.read']],
        // ['https://api.myapplication.com/users/*', ['customscope.read']],
        ['http://localhost:8080/about/', null]
      ])
    })
  ],
  declarations: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
