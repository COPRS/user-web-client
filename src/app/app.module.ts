/**
 * Copyright 2023 Airbus
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapViewerModule } from './map-viewer/map-viewer.module';
import { FormsModule } from '@angular/forms';
import { ConfigService } from './services/config.service';
import { FilterSidebarComponent } from './filter-sidebar/components/filter-sidebar/filter-sidebar.component';
import { ProductDetailsComponent } from './filter-sidebar/components/product-details/product-details.component';
import { FilterElementComponent } from './filter-sidebar/components/filter-element/filter-element.component';
import { FilterElementListComponent } from './filter-sidebar/components/filter-element-list/filter-element-list.component';
import { MapSwitcherComponent } from './map-viewer/components/map-switcher/map-switcher.component';
import { QueryResultGridComponent } from './filter-sidebar/query-result-grid/query-result-grid.component';
import { FileSizePipe } from './filter-sidebar/query-result-grid/file-size.pipe';
import { LimitToPipe } from './filter-sidebar/query-result-grid/limit-to.pipe';
import { RegionSelectionFilterElementComponent } from './filter-sidebar/components/region-selection-filter-element/region-selection-filter-element.component';
import {
  KeycloakAngularModule,
  KeycloakEventType,
  KeycloakService,
} from 'keycloak-angular';
import { Location } from '@angular/common';
import { LoginStatusService } from './services/login-status.service';
import { ProductDownloadUrlPipe } from 'src/app/filter-sidebar/query-result-grid/product-download-url.pipe';
import { SecurePipe } from './shared/pipes/secure.pipe';

export function initializeApp(configService: ConfigService) {
  return () => configService.load();
}

function initializeKeycloak(
  keycloak: KeycloakService,
  configService: ConfigService,
  location: Location,
  loginStatusService: LoginStatusService
) {
  return async () => {
    keycloak.keycloakEvents$.subscribe((e) => {
      if (
        e.type === KeycloakEventType.OnAuthSuccess ||
        e.type === KeycloakEventType.OnAuthRefreshSuccess ||
        (e.type === KeycloakEventType.OnReady && e.args === true)
      ) {
        loginStatusService.setLoggedIn(true);
      } else if (e.type == KeycloakEventType.OnTokenExpired) {
        keycloak.updateToken();
      } else {
        loginStatusService.setLoggedIn(false);
      }
    });

    const config = await configService.getSettings();
    const silentCheckSsoRedirectUri =
      window.location.origin +
      location.prepareExternalUrl('/assets/silent-check-sso.html');

    return keycloak
      .init({
        config: config.keycloak,
        initOptions: {
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri,
        },
        bearerExcludedUrls: ['/assets'],
      })
      .catch((e) => {
        console.error(e);
      });
  };
}

@NgModule({
  declarations: [
    AppComponent,
    FilterSidebarComponent,
    ProductDetailsComponent,
    FilterElementComponent,
    FilterElementListComponent,
    MapSwitcherComponent,
    QueryResultGridComponent,
    FileSizePipe,
    LimitToPipe,
    SecurePipe,
    ProductDownloadUrlPipe,
    RegionSelectionFilterElementComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ClarityModule,
    MapViewerModule,
    FormsModule,
    KeycloakAngularModule,
  ],
  providers: [
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, ConfigService, Location, LoginStatusService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
