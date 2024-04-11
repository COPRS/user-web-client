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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  MapRegionSelection,
  MapRegionSelectionService,
  SelectionType,
} from 'src/app/map-viewer/services/map-region-selection.service';

@Component({
  selector: 'app-region-selection-filter-element',
  templateUrl: './region-selection-filter-element.component.html',
  styleUrls: ['./region-selection-filter-element.component.scss'],
})
export class RegionSelectionFilterElementComponent
  implements OnInit, OnDestroy
{
  selectedRegion$: Observable<MapRegionSelection>;
  isSelectionActive: boolean;
  private readonly onDestroy = new Subject<void>();

  constructor(private mapRegionSelectionService: MapRegionSelectionService) {}
  ngOnDestroy(): void {
    this.onDestroy.next();
  }

  ngOnInit(): void {
    this.selectedRegion$ = this.mapRegionSelectionService.getSelection();
    this.mapRegionSelectionService
      .getSelectionStarted()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => (this.isSelectionActive = true));
    this.mapRegionSelectionService
      .getSelection()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => (this.isSelectionActive = false));
    this.mapRegionSelectionService
      .getSelectionAborted()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => (this.isSelectionActive = false));
  }

  startGeopgraphicSelection(type: SelectionType) {
    this.mapRegionSelectionService.startSelection(type);
  }

  abortGeopgraphicSelection() {
    this.mapRegionSelectionService.abortSelection();
  }

  clearGeopgraphicSelection() {
    this.mapRegionSelectionService.clearSelection();
  }
}
