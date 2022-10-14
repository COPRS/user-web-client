import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { DdipService } from 'src/app/services/ddip/ddip.service';
import { DdipProduct } from 'src/app/services/models/DdipProductResponse';
import { ProductSelectionService } from 'src/app/services/product-selection.service';
import {
  FilterSidebarNavigationService,
  SideBarSubNav,
} from '../services/filter-sidebar-navigation.service';
import { QueryResultService } from '../services/query-result.service';

@Component({
  selector: 'app-query-result-grid',
  templateUrl: './query-result-grid.component.html',
  styleUrls: ['./query-result-grid.component.scss'],
})
export class QueryResultGridComponent implements OnInit, OnDestroy {
  products: DdipProduct[];
  total: number;
  pageSize: number = 15;
  loading: Observable<boolean>;
  public selected: DdipProduct[];
  private readonly onDestroy = new Subject<void>();
  meta4File$: Observable<string>;

  constructor(
    private queryResultService: QueryResultService,
    private productSelectionService: ProductSelectionService,
    private filterSidebarNavigationService: FilterSidebarNavigationService,
    private ddipService: DdipService
  ) {
    this.loading = this.queryResultService
      .getIsLoading()
      .pipe(map((l) => l.loading));
  }

  ngOnInit(): void {
    this.queryResultService
      .getFilteredProducts()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((page) => {
        this.products = page.products;
        this.total = page.totalCount;
      });

    this.productSelectionService
      .getSelectedProducts()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(async (selected) => {
        if (!selected) {
          this.selected = [];
        } else {
          this.selected = this.products.filter((e) =>
            selected.some((s) => e.Id === s.Id)
          );
        }
      });

    this.meta4File$ = this.productSelectionService
      .getSelectedProducts()
      .pipe(
        map((p) =>
          p.length > 0
            ? this.ddipService.constructMetalinkDownloadfile(p)
            : undefined
        )
      );
  }

  async downloadProducts() {
    this.meta4File$.pipe(take(1)).subscribe((data) => {
      const c = document.createElement('a');
      c.download = 'products.meta4';

      var t = new Blob([data], {
        type: 'text/plain',
      });
      c.href = window.URL.createObjectURL(t);
      c.click();
    });
  }

  refresh(state: ClrDatagridStateInterface) {
    const skip = state.page.from > 0 ? state.page.from : undefined;
    this.queryResultService.setPagination(state.page.size, skip);
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  selectionChanged(selectedProducts: DdipProduct[]) {
    this.productSelectionService.clearSelectedProducts();
    selectedProducts?.forEach((p) =>
      this.productSelectionService.addSelectedProduct(p)
    );
  }

  goToDetailsTab($event) {
    const selectedProduct = $event as DdipProduct;
    this.productSelectionService.setHighlightProduct(selectedProduct);
    this.filterSidebarNavigationService.setSelectedSubNav(
      SideBarSubNav.DETAILS
    );
    this.filterSidebarNavigationService.setShowNav(true);
  }
}
