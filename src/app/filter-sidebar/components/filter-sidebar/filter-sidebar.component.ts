import { style, transition, trigger, animate } from '@angular/animations';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DdipService } from 'src/app/services/ddip.service';
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

  @Input() duration: number = 0.25;
  @Input() navWidth: number = window.innerWidth;

  constructor(
    private navService: FilterSidebarNavigationService,
    private filterElementsService: FilterElementsService,
    private ddipService: DdipService
  ) {}

  ngOnInit(): void {
    this.queryFilterFromService$ = this.filterElementsService.getQuery();
    this.showSideNav$ = this.navService.getShowNav();
    this.queryFilterFromService$.subscribe(
      async (f) =>
        (this.queryResultFromService = await this.ddipService.getProducts(f))
    );
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
}
