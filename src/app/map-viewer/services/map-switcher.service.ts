import { Injectable } from '@angular/core';
import { OSM, Stamen, TileWMS } from 'ol/source';
import TileSource from 'ol/source/Tile';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';

@Injectable({
  providedIn: 'root',
})
export class MapSwitcherService {
  private maps: AvailableMap[] = [];
  private selectedMap$ = new BehaviorSubject<AvailableMap>(undefined);

  constructor(config: ConfigService) {
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
    if (this.maps[0]) {
      this.selectedMap$.next(this.maps[0]);
    } else {
      alert('ERROR: No backgroud map(s) configured');
    }
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

export type AvailableMap = { mapName: string; sources: TileSource[] };
