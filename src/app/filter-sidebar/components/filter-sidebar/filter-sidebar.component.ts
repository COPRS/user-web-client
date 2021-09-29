import { style, transition, trigger, animate } from '@angular/animations';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SelectedMissionAndProduct } from '../../models/SelectedMissionAndProduct';
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
  showSideNav: Observable<boolean>;
  selectedProduct$: BehaviorSubject<SelectedMissionAndProduct> =
    new BehaviorSubject<SelectedMissionAndProduct>({
      mission: 's1',
      productType: 'l0-cal',
    });

  @Input() duration: number = 0.25;
  @Input() navWidth: number = window.innerWidth;

  constructor(private navService: FilterSidebarNavigationService) {}

  ngOnInit(): void {
    this.showSideNav = this.navService.getShowNav();
  }

  onSidebarClose() {
    this.navService.setShowNav(false);
  }
  onSidebarOpen() {
    this.navService.setShowNav(true);
  }

  onSelectedProductChanged(event: SelectedMissionAndProduct) {
    if (event) {
      this.selectedProduct$.next(event);
    } else {
      this.selectedProduct$.next(undefined);
    }
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
