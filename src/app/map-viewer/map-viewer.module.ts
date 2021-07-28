import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MapComponent } from './components/map/map.component';
import { MapViewerComponent } from './map-viewer.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [MapComponent, MapViewerComponent],
  imports: [CommonModule, HttpClientModule],
  providers: [DecimalPipe],
  exports: [MapViewerComponent],
})
export class MapViewerModule {}
