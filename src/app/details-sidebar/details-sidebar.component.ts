import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DetailsSidebarNavigationService } from '../services/details-sidebar-navigation.service';

@Component({
  selector: 'app-details-sidebar',
  templateUrl: './details-sidebar.component.html',
  styleUrls: ['./details-sidebar.component.scss'],
})
export class DetailsSidebarComponent implements OnInit {
  showSideNav$: Observable<string>;
  @Input() duration: number = 0.25;
  @Input() navWidth: number = window.innerWidth;

  constructor(private navService: DetailsSidebarNavigationService) {}

  ngOnInit(): void {
    this.showSideNav$ = this.navService.getShowNav();
  }

  onSidebarClose() {
    this.navService.setShowNav(undefined);
  }

  getSideNavBarStyle(showNav: string) {
    let navBarStyle: any = {};

    navBarStyle.transition =
      this.duration + 's, visibility ' + this.duration + 's';
    navBarStyle.width = this.navWidth + 'px';
    navBarStyle.right = (!!showNav ? 0 : this.navWidth * -1) + 'px';

    return navBarStyle;
  }
}
