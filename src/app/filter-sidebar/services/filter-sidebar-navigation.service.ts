import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum SideBarSubNav {
  FILTERS = 'FILTERS',
  RESULTS = 'RESULTS',
}

@Injectable({
  providedIn: 'root',
})
export class FilterSidebarNavigationService {
  private showNav$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );
  private selectedSubNav$: BehaviorSubject<SideBarSubNav> =
    new BehaviorSubject<SideBarSubNav>(SideBarSubNav.FILTERS);

  constructor() {}

  getShowNav() {
    return this.showNav$.asObservable();
  }

  setShowNav(showHide: boolean) {
    this.showNav$.next(showHide);
  }

  toggleNavState() {
    this.showNav$.next(!this.showNav$.value);
  }

  isNavOpen() {
    return this.showNav$.value;
  }

  getSelectedSubNav() {
    return this.selectedSubNav$.asObservable();
  }

  setSelectedSubNav(selectedSubNav: SideBarSubNav) {
    this.selectedSubNav$.next(selectedSubNav);
  }
}
