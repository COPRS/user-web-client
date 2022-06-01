import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ConfigService } from 'src/app/services/config.service';
import { IAppConfig } from 'src/app/services/models/IAppConfig';
import { ProductSelectionService } from 'src/app/services/product-selection.service';
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
    private configService: ConfigService,
    private productSelectionService: ProductSelectionService
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
    this.productSelectionService
      .getSelectedProduct()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((p) => {
        if (p) {
          this.onSubNavClick(SideBarSubNav.DETAILS);
          this.navService.setShowNav(true);
        }
      });
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
    navBarStyle.minWidth = '450px';

    return navBarStyle;
  }

  async onManualFilterQueryChange(target: any) {
    this.filterElementsService.updateWithManualFilter(target.value);
  }

  onSubNavClick(selectedSubNav: SideBarSubNav) {
    this.navService.setSelectedSubNav(selectedSubNav);
  }
}
