import { Injectable } from '@angular/core';
import { OSM, Stamen, XYZ } from 'ol/source';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapSwitcherService {
  private maps: AvailableMap[] = [
    { mapName: 'OSM', layer: new OSM() },
    { mapName: 'Stamen', layer: new Stamen({ layer: 'watercolor' }) },
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

export type AvailableMap = { mapName: string; layer: XYZ };
