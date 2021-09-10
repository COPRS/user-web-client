import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DetailsSidebarNavigationService {
  private selectedFeature$: BehaviorSubject<string> =
    new BehaviorSubject<string>(undefined);

  constructor() {}

  ngOnInit() {}

  getShowNav() {
    return this.selectedFeature$.asObservable();
  }

  setShowNav(selectedFeatureId: string) {
    this.selectedFeature$.next(selectedFeatureId);
  }

  isNavOpen() {
    return this.selectedFeature$.value;
  }
}
