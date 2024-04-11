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
