import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { FilterSidebarNavigationService } from 'src/app/filter-sidebar/services/filter-sidebar-navigation.service';

@Injectable({
  providedIn: 'root',
})
export class MapRegionSelectionService {
  private selectionActive$ = new BehaviorSubject<{
    event: 'start' | 'abort' | 'finish';
    value?: SelectionType | MapRegionSelection;
  }>({ event: 'abort' });

  constructor(
    private filterSidebarNavigationService: FilterSidebarNavigationService
  ) {}

  startSelection(type: SelectionType) {
    this.selectionActive$.next({ event: 'start', value: type });
    this.filterSidebarNavigationService.setShowNav(false);
  }

  finishSelection(selection: MapRegionSelection) {
    this.selectionActive$.next({ event: 'finish', value: selection });
    this.filterSidebarNavigationService.setShowNav(true);
  }

  clearSelection() {
    this.selectionActive$.next({ event: 'finish', value: undefined });
  }

  abortSelection() {
    this.selectionActive$.next({ event: 'abort' });
    this.filterSidebarNavigationService.setShowNav(true);
  }

  getSelectionStarted(): Observable<SelectionType> {
    return this.selectionActive$.pipe(
      filter((e) => e.event === 'start'),
      map((e) => e.value as SelectionType)
    );
  }

  getSelection(): Observable<MapRegionSelection> {
    return this.selectionActive$.pipe(
      filter((e) => e.event === 'finish'),
      map((e) => e.value as MapRegionSelection)
    );
  }

  getSelectionAborted(): Observable<undefined> {
    return this.selectionActive$.pipe(
      filter((e) => e.event === 'abort'),
      map(() => undefined)
    );
  }
}

export interface MapRegionSelection {
  coordinates: number[][][];
}

export type SelectionType = 'Polygon';
