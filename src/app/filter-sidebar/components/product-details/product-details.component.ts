import { Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { DdipProduct } from 'src/app/services/models/DdipProductResponse';
import { ProductSelectionService } from 'src/app/services/product-selection.service';
import { QueryResultService } from '../../services/query-result.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent {
  showSideNav$: Observable<boolean>;
  selectedProduct$: Observable<DdipProduct>;
  selectedProductPageIndex$: Observable<
    { idx: number; totalLength: number } | undefined
  >;

  constructor(
    private productSelectionService: ProductSelectionService,
    private queryResultService: QueryResultService
  ) {
    this.showSideNav$ = this.productSelectionService
      .getHighlightedProduct()
      .pipe(map((p) => !!p));
    this.selectedProduct$ =
      this.productSelectionService.getHighlightedProduct();
    this.selectedProductPageIndex$ = combineLatest([
      this.selectedProduct$,
      this.queryResultService
        .getFilteredProducts()
        .pipe(map((r) => r.products)),
    ]).pipe(
      map((e) => {
        const [selected, currentPage] = e;
        if (selected && currentPage) {
          const idx = currentPage.findIndex((f) => f.Id === selected.Id);
          return { idx, totalLength: currentPage.length };
        } else {
          return undefined;
        }
      })
    );
  }

  selectPreviousProduct() {
    this.goToOffsetIntList(-1);
  }

  selectNextProduct() {
    this.goToOffsetIntList(1);
  }

  goToOffsetIntList(offset: number) {
    combineLatest([
      this.selectedProductPageIndex$,
      this.queryResultService
        .getFilteredProducts()
        .pipe(map((r) => r.products)),
    ])
      .pipe(take(1))
      .subscribe((res) => {
        const [selected, currentPage] = res;
        if (selected && currentPage) {
          const nextIdx = selected.idx + offset;

          if (nextIdx >= 0 && nextIdx < currentPage.length) {
            this.productSelectionService.unsetHighlightProduct();
            this.productSelectionService.setHighlightProduct(
              currentPage[nextIdx]
            );
          }
        }
      });
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
