import { Component, OnInit } from '@angular/core';
import { MapSwitcherService } from '../../services/map-switcher.service';

@Component({
  selector: 'app-map-switcher',
  templateUrl: './map-switcher.component.html',
  styleUrls: ['./map-switcher.component.scss'],
})
export class MapSwitcherComponent implements OnInit {
  constructor(private mapSwitcherService: MapSwitcherService) {}

  public availableMaps: string[];
  public activeMap: string;

  ngOnInit(): void {
    this.availableMaps = this.mapSwitcherService.getAvailableMapLayers();
    this.mapSwitcherService.getSelectedMap().subscribe((m) => {
      this.activeMap = m.mapName;
    });
  }

  public onChangeMapClick(mapName: string) {
    this.mapSwitcherService.setSelectedMap(mapName);
  }
}
