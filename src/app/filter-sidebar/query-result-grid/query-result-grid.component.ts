import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { DetailsSidebarNavigationService } from 'src/app/details-sidebar/services/details-sidebar-navigation.service';
import { DdipProduct } from 'src/app/services/models/DdipProductResponse';
import { QueryResultService } from '../services/query-result.service';

@Component({
  selector: 'app-query-result-grid',
  templateUrl: './query-result-grid.component.html',
  styleUrls: ['./query-result-grid.component.scss'],
})
export class QueryResultGridComponent implements OnInit, OnDestroy {
  products: DdipProduct[];
  total: number;
  pageSize: number = 20;
  loading: Observable<boolean>;
  public rowSelection: boolean = true;
  public selected: DdipProduct[] = [];
  private readonly onDestroy = new Subject<void>();

  constructor(
    private queryResultService: QueryResultService,
    private detailsNavService: DetailsSidebarNavigationService
  ) {
    this.loading = this.queryResultService
      .getIsLoading()
      .pipe(map((l) => l.loading));
  }

  ngOnInit(): void {
    this.queryResultService.setPagination(this.pageSize);
    this.queryResultService
      .getFilteredProducts()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((page) => {
        this.products = page.products;
        this.total = page.totalCount;
      });

    this.detailsNavService
      .getSelectedProduct()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(async (selected) => {
        // TODO: select or deselect when changed from outside}
        // if (!selected) {
        //   this.selected = [];
        // } else {
        //   console.log({ selected });
        //   // this.selected = this.products.filter((e) => e.Id === selected);
        //   console.log('selected object', this.selected);
        // }
      });
  }

  refresh(state: ClrDatagridStateInterface) {
    const skip = state.page.from > 0 ? state.page.from : undefined;
    this.queryResultService.setPagination(state.page.size, skip);
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  selectionChanged($event) {
    const selectedProduct = $event as DdipProduct;
    this.detailsNavService.setSelectedProduct(selectedProduct);
  }
  trackById(_index: number, item: DdipProduct) {
    return item.Id;
  }
}
