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
import { DetailsSidebarComponent } from './details-sidebar/components/details-sidebar/details-sidebar.component';
import { FilterElementComponent } from './filter-sidebar/components/filter-element/filter-element.component';
import { FilterElementListComponent } from './filter-sidebar/components/filter-element-list/filter-element-list.component';
import { MapSwitcherComponent } from './map-viewer/components/map-switcher/map-switcher.component';
import { QueryResultGridComponent } from './filter-sidebar/query-result-grid/query-result-grid.component';
import { FileSizePipe } from './filter-sidebar/query-result-grid/file-size.pipe';
import { LimitToPipe } from './filter-sidebar/query-result-grid/limit-to.pipe';
import { RegionSelectionFilterElementComponent } from './filter-sidebar/components/region-selection-filter-element/region-selection-filter-element.component';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

export function initializeApp(configService: ConfigService) {
  return () => configService.load();
}

function initializeKeycloak(
  keycloak: KeycloakService,
  configService: ConfigService
) {
  return async () => {
    const config = await configService.getSettings();
    return keycloak.init({
      config: config.keycloak,
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
      },
      bearerExcludedUrls: ['/assets'],
    });
  };
}

@NgModule({
  declarations: [
    AppComponent,
    FilterSidebarComponent,
    DetailsSidebarComponent,
    FilterElementComponent,
    FilterElementListComponent,
    MapSwitcherComponent,
    QueryResultGridComponent,
    FileSizePipe,
    LimitToPipe,
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
      deps: [KeycloakService, ConfigService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
