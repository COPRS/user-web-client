import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import GeoJSON from 'ol/format/GeoJSON';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Zoom } from 'ol/control';
import { fromLonLat } from 'ol/proj';
import { FootPrintService } from '../services/foot-print.service';

@Component({
  selector: 'app-map-viewer',
  templateUrl: './map-viewer.component.html',
  styleUrls: ['./map-viewer.component.scss'],
})
export class MapViewerComponent implements OnInit {
  map: Map;

  constructor(private api: FootPrintService) {}

  ngOnInit(): void {
    this.map = new Map({
      view: new View({
        center: fromLonLat([10.439822673797607, 53.25974365592727]),
        zoom: 4,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
    });

    this.map.getControls().forEach((control) => {
      if (control instanceof Zoom) {
        this.map.removeControl(control);
      }
    });

    this.api.getSimplePoints().then((features) => {
      this.map.addLayer(
        new VectorLayer({
          source: new VectorSource({
            features: new GeoJSON().readFeatures(features, {
              featureProjection: 'EPSG:3857',
            }),
          }),
        })
      );
    });
  }
}
