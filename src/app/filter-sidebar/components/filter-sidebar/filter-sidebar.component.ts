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

import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from 'src/app/services/config.service';
import { IAppConfig } from 'src/app/services/models/IAppConfig';
import { FilterElementsService } from '../../services/filter-elements.service';
import {
  FilterSidebarNavigationService,
  SideBarSubNav,
} from '../../services/filter-sidebar-navigation.service';
import {
  LoadingStatus,
  QueryResultService,
} from '../../services/query-result.service';

@Component({
  selector: 'app-filter-sidebar',
  templateUrl: './filter-sidebar.component.html',
  styleUrls: ['./filter-sidebar.component.scss'],
  animations: [
    trigger('panelInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.8s', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('0.1s', style({ opacity: 0 }))]),
    ]),
  ],
})
export class FilterSidebarComponent implements OnInit, OnDestroy {
  showSideNav$: Observable<boolean>;
  selectedSubNav$: Observable<SideBarSubNav>;
  SideBarSubNav = SideBarSubNav;
  filterCount$: Observable<number | string>;
  resultCount$: Observable<number>;
  queryFilterFromService$: Observable<string>;
  queryResultFromService: any;
  settings: IAppConfig;
  loadingStatus$: Observable<LoadingStatus>;
  private readonly onDestroy = new Subject<void>();

  @Input() duration: number = 0.25;
  @Input() navWidth: number = window.innerWidth;

  constructor(
    private navService: FilterSidebarNavigationService,
    private filterElementsService: FilterElementsService,
    private queryResultService: QueryResultService,
    private configService: ConfigService
  ) {}

  ngOnDestroy(): void {
    this.onDestroy.next();
  }

  ngOnInit(): void {
    this.queryFilterFromService$ = this.filterElementsService.getQuery();
    this.filterCount$ = this.filterElementsService.getFilterCount();
    this.resultCount$ = this.queryResultService
      .getFilteredProducts()
      .pipe(map((e) => e.totalCount));
    this.showSideNav$ = this.navService.getShowNav();
    this.selectedSubNav$ = this.navService.getSelectedSubNav();
    this.settings = this.configService.settings;
    this.loadingStatus$ = this.queryResultService.getIsLoading();
  }

  onSidebarClose() {
    this.navService.setShowNav(false);
  }
  onSidebarOpen() {
    this.navService.setShowNav(true);
  }

  getSideNavBarStyle(showNav: boolean) {
    let navBarStyle: any = {};

    navBarStyle.transition =
      this.duration + 's, visibility ' + this.duration + 's';
    navBarStyle.width = this.navWidth + 'vw';
    navBarStyle.left = (showNav ? 0 : this.navWidth * -1) + 'vw';
    navBarStyle.minWidth = '500px';

    return navBarStyle;
  }

  async onManualFilterQueryChange(target: any) {
    this.filterElementsService.updateWithManualFilter(target.value);
  }

  onSubNavClick(selectedSubNav: SideBarSubNav) {
    this.navService.setSelectedSubNav(selectedSubNav);
  }
}
