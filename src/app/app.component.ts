import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';
import { LoginStatusService } from './services/login-status.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private keycloak: KeycloakService,
    protected readonly location: Location,
    loginStatusService: LoginStatusService
  ) {
    this.isLoggedIn = loginStatusService.getIsLoggedIn();
  }
  title = 'user-web-client';
  isLoggedIn: Observable<boolean>;

  onLogout() {
    const redirectUri =
      window.location.origin + this.location.prepareExternalUrl('');
    this.keycloak.login({
      redirectUri,
    });
  }
}
