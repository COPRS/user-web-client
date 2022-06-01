import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DdipService } from 'src/app/services/ddip/ddip.service';
import { DdipProduct } from 'src/app/services/models/DdipProductResponse';
import { ProductSelectionService } from 'src/app/services/product-selection.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent {
  showSideNav$: Observable<boolean>;
  selectedProduct$: Observable<DdipProduct>;
  downloadUrl$: Observable<string>;
  constructor(
    private productSelectionService: ProductSelectionService,
    private ddipService: DdipService
  ) {
    this.showSideNav$ = this.productSelectionService
      .getSelectedProduct()
      .pipe(map((p) => !!p));
    this.selectedProduct$ = this.productSelectionService.getSelectedProduct();
    this.downloadUrl$ = this.productSelectionService.getSelectedProduct().pipe(
      filter((p) => !!p),
      map((p) => this.ddipService.constructorDownloadUrl(p.Id))
    );
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
