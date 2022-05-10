import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected readonly router: Router,
    protected readonly keycloak: KeycloakService,
    protected readonly location: Location
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated) {
      const redirectUri =
        window.location.origin + this.location.prepareExternalUrl(state.url);
      await this.keycloak.login({
        redirectUri,
      });
    }

    return true;
  }
}
