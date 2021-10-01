import { style, transition, trigger, animate } from '@angular/animations';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterSidebarNavigationService } from '../../services/filter-sidebar-navigation.service';
import { FilterSidebarSelectionService } from '../../services/filter-sidebar-selection.service';

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
  showSideNav: Observable<boolean>;
  availableAttributes$: Observable<any>;

  @Input() duration: number = 0.25;
  @Input() navWidth: number = window.innerWidth;

  constructor(
    private navService: FilterSidebarNavigationService,
    private selectionService: FilterSidebarSelectionService
  ) {}

  ngOnInit(): void {
    this.showSideNav = this.navService.getShowNav();
    this.availableAttributes$ = this.selectionService.getAvailableAttributes();
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
