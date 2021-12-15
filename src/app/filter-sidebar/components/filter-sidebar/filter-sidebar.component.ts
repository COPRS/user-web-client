import { style, transition, trigger, animate } from '@angular/animations';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { DdipService } from 'src/app/services/ddip.service';
import { IAppConfig } from 'src/app/services/models/IAppConfig';
import { FilterElementsService } from '../../services/filter-elements.service';
import { FilterSidebarNavigationService } from '../../services/filter-sidebar-navigation.service';

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
  encapsulation: ViewEncapsulation.None,
})
export class FilterSidebarComponent implements OnInit {
  showSideNav$: Observable<boolean>;
  queryFilterFromService$: Observable<string>;
  queryResultFromService: any;
  settings: IAppConfig;

  @Input() duration: number = 0.25;
  @Input() navWidth: number = window.innerWidth;

  constructor(
    private navService: FilterSidebarNavigationService,
    private filterElementsService: FilterElementsService,
    private ddipService: DdipService,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {
    this.queryFilterFromService$ = this.filterElementsService.getQuery();
    this.showSideNav$ = this.navService.getShowNav();
    this.queryFilterFromService$.subscribe(
      async (f) =>
        (this.queryResultFromService = await this.ddipService.getProducts(f))
    );
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

  onApiUrlChange(target: any) {
    this.configService.setApiBaseUrl(target.value);
  }

  onApiResourceChange(target: any) {
    this.configService.setResourceName(target.value);
  }

  async onFilterQueryChange(target: any) {
    this.queryResultFromService = await this.ddipService.getProducts(
      target.value
    );
  }
}
