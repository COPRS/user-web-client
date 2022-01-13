import { style, transition, trigger, animate } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from 'src/app/services/config.service';
import { IAppConfig } from 'src/app/services/models/IAppConfig';
import { FilterElementsService } from '../../services/filter-elements.service';
import {
  FilterSidebarNavigationService,
  SideBarSubNav,
} from '../../services/filter-sidebar-navigation.service';
import { QueryResultService } from '../../services/query-result.service';

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
export class FilterSidebarComponent implements OnInit {
  showSideNav$: Observable<boolean>;
  selectedSubNav$: Observable<SideBarSubNav>;
  SideBarSubNav = SideBarSubNav;
  filterCount$: Observable<number | string>;
  resultCount$: Observable<number>;
  queryFilterFromService$: Observable<string>;
  queryResultFromService: any;
  settings: IAppConfig;

  @Input() duration: number = 0.25;
  @Input() navWidth: number = window.innerWidth;

  constructor(
    private navService: FilterSidebarNavigationService,
    private filterElementsService: FilterElementsService,
    private dataService: QueryResultService,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {
    this.queryFilterFromService$ = this.filterElementsService.getQuery();
    this.filterCount$ = this.filterElementsService.getFilterCount();
    this.resultCount$ = this.dataService
      .getFilteredProducts()
      .pipe(map((e) => e.totalCount));
    this.showSideNav$ = this.navService.getShowNav();
    this.selectedSubNav$ = this.navService.getSelectedSubNav();
    this.settings = this.configService.settings;
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
    navBarStyle.width = this.navWidth + 'px';
    navBarStyle.left = (showNav ? 0 : this.navWidth * -1) + 'px';

    return navBarStyle;
  }

  async onManualFilterQueryChange(target: any) {
    this.filterElementsService.updateWithManualFilter(target.value);
  }

  onSubNavClick(selectedSubNav: SideBarSubNav) {
    this.navService.setSelectedSubNav(selectedSubNav);
  }
}
