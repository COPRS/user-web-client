import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapViewerModule } from './map-viewer/map-viewer.module';
import { FilterSidebarComponent } from './filter-sidebar/filter-sidebar.component';

@NgModule({
  declarations: [AppComponent, FilterSidebarComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ClarityModule,
    MapViewerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
