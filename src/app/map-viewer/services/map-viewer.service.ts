import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MapViewerService {
  private zoomToExtent$ = new BehaviorSubject<any>(undefined);

  constructor() {}

  public setZoomToExtent(extent: any) {
    this.zoomToExtent$.next(extent);
  }

  public getZoomToExtent() {
    return this.zoomToExtent$.pipe(filter((m) => m !== undefined));
  }
}
