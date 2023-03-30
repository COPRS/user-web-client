import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
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
  }

  downloadProduct(product: DdipProduct) {
    const downloadUrl = this.ddipService.constructDownloadUrl(product.Id);
    console.log(product);
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', downloadUrl);
    link.setAttribute('download', `products.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
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
