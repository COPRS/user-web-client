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
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

export enum SideBarSubNav {
  FILTERS = 'FILTERS',
  RESULTS = 'RESULTS',
  DETAILS = 'DETAILS',
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
