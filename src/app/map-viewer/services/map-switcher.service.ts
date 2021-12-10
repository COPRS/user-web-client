import { Injectable } from '@angular/core';
import { OSM, Stamen, TileWMS, XYZ } from 'ol/source';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapSwitcherService {
  private maps: AvailableMap[] = [
    { mapName: 'OSM', sources: [new OSM()] },
    {
      mapName: 'Stamen',
      sources: [
        new Stamen({ layer: 'watercolor' }),
        new Stamen({
          layer: 'terrain-labels',
        }),
      ],
    },
    {
      mapName: 'EOX',
      sources: [
        new TileWMS({
          wrapX: false,
          params: { TILED: true, LAYERS: 'osm_3857' },
          url: 'https://tiles.esa.maps.eox.at/wms',
        }),
      ],
    },
  ];
  private selectedMap$ = new BehaviorSubject<AvailableMap>(this.maps[0]);

  constructor() {}

  setSelectedMap(mapName: string) {
    const layer = this.maps.find((e) => e.mapName === mapName);
    if (layer) {
      this.selectedMap$.next(layer);
    }
  }

  getAvailableMapLayers(): string[] {
    return JSON.parse(JSON.stringify(this.maps.map((l) => l.mapName)));
  }

  getSelectedMap() {
    return this.selectedMap$.asObservable();
  }
}

export type AvailableMap = { mapName: string; sources: XYZ[] };
