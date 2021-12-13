import { Injectable } from '@angular/core';
import { OSM, Stamen, TileWMS, XYZ } from 'ol/source';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';

@Injectable({
  providedIn: 'root',
})
export class MapSwitcherService {
  private maps: AvailableMap[] = [
    { mapName: 'OSM', sources: [new OSM()] },
    {
      mapName: 'Stamen (watercolor)',
      sources: [
        new Stamen({ layer: 'watercolor' }),
        new Stamen({
          layer: 'terrain-labels',
        }),
      ],
    },
  ];
  private selectedMap$ = new BehaviorSubject<AvailableMap>(this.maps[0]);

  constructor(private config: ConfigService) {
    config.settings.mapBackgrounds.forEach((mb) => {
      this.maps.push({
        mapName: mb.name,
        sources: mb.layers.map(
          (l) =>
            new TileWMS({
              wrapX: false,
              params: { TILED: true, LAYERS: l.layerName },
              url: l.url,
            })
        ),
      });
    });
  }

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
