import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapViewerModule } from './map-viewer/map-viewer.module';
import { FormsModule } from '@angular/forms';
import { FilterAttributeSelectionComponent } from './filter-sidebar/components/filter-attribute-selection/filter-attribute-selection.component';
import { ConfigService } from './services/config.service';
import { FilterSidebarComponent } from './filter-sidebar/components/filter-sidebar/filter-sidebar.component';
import { FilterProductTypeSelectionComponent } from './filter-sidebar/components/filter-product-type-selection/filter-product-type-selection.component';
import { DetailsSidebarComponent } from './details-sidebar/components/details-sidebar/details-sidebar.component';

export function initializeApp(configService: ConfigService) {
  return () => configService.load();
}

@NgModule({
  declarations: [
    AppComponent,
    FilterSidebarComponent,
    FilterProductTypeSelectionComponent,
    FilterAttributeSelectionComponent,
    DetailsSidebarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ClarityModule,
    MapViewerModule,
    FormsModule,
  ],
  providers: [
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
