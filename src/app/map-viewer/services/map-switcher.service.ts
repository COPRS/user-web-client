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

import { Injectable } from '@angular/core';
import { OSM, TileWMS } from 'ol/source';
import TileSource from 'ol/source/Tile';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
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

    if (this.maps.length === 0) {
      this.maps.push({ mapName: 'OSM', sources: [new OSM()] });
    }

    this.selectedMap$.next(this.maps[0]);
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
    return this.selectedMap$.pipe(filter((m) => m !== undefined));
  }
}

export type AvailableMap = { mapName: string; sources: TileSource[] };
