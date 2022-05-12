import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';
import { LoginStatusService } from './services/login-status.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private keycloak: KeycloakService,
    loginStatusService: LoginStatusService
  ) {
    this.isLoggedIn = loginStatusService.getIsLoggedIn();
  }
  title = 'user-web-client';
  isLoggedIn: Observable<boolean>;

  async onLogout() {
    await this.keycloak.logout();
  }
}
