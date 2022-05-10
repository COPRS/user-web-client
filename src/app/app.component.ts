import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private keycloak: KeycloakService) {}
  title = 'user-web-client';

  async onLogout() {
    this.keycloak.logout();
  }
}
