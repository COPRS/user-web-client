import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  MapRegionSelection,
  MapRegionSelectionService,
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

  startGeopgraphicSelection() {
    this.mapRegionSelectionService.startSelection('Polygon');
  }

  abortGeopgraphicSelection() {
    this.mapRegionSelectionService.abortSelection();
  }

  clearGeopgraphicSelection() {
    this.mapRegionSelectionService.clearSelection();
  }
}
