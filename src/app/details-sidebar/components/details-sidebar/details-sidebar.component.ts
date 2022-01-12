import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DdipService } from 'src/app/services/ddip/ddip.service';
import { DdipProduct } from 'src/app/services/models/DdipProductResponse';
import { DetailsSidebarNavigationService } from '../../services/details-sidebar-navigation.service';

@Component({
  selector: 'app-details-sidebar',
  templateUrl: './details-sidebar.component.html',
  styleUrls: ['./details-sidebar.component.scss'],
})
export class DetailsSidebarComponent implements OnInit {
  showSideNav$: Observable<boolean>;
  selectedProduct$: Observable<DdipProduct>;
  downloadUrl$: Observable<string>;
  @Input() duration: number = 0.25;
  @Input() navWidth: number = window.innerWidth;

  constructor(
    private navService: DetailsSidebarNavigationService,
    private ddipService: DdipService
  ) {
    this.showSideNav$ = this.navService
      .getSelectedProduct()
      .pipe(map((p) => !!p));
    this.selectedProduct$ = this.navService.getSelectedProduct();
    this.downloadUrl$ = this.navService
      .getSelectedProduct()
      .pipe(map((p) => this.ddipService.constructorDownloadUrl(p.Id)));
  }

  ngOnInit(): void {}

  onSidebarClose() {
    this.navService.setSelectedProduct(undefined);
  }

  getSideNavBarStyle(showNav: any) {
    let navBarStyle: any = {};

    navBarStyle.transition =
      this.duration + 's, visibility ' + this.duration + 's';
    navBarStyle.width = this.navWidth + 'px';
    navBarStyle.right = (!!showNav ? 0 : this.navWidth * -1) + 'px';

    return navBarStyle;
  }

  rootDirectory: any[] = [
    {
      name: 'Files',
      icon: 'folder',
      expanded: true,
      files: [
        {
          icon: 'file',
          name: 'file',
          active: false,
        },
        {
          icon: 'file',
          name: 'file',
          active: false,
        },
        {
          icon: 'file',
          name: 'file',
          active: false,
        },
        {
          icon: 'file',
          name: 'file',
          active: false,
        },
      ],
    },
  ];
}
