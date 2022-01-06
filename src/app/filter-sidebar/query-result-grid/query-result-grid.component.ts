import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
  pageSize: number = 10;
  loading: boolean = false;
  selected: DdipProduct[];
  private readonly onDestroy = new Subject<void>();

  constructor(private dataService: QueryResultService) {}

  ngOnInit(): void {
    this.dataService.setPagination(this.pageSize);
    this.dataService
      .getFilteredProducts()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((page) => {
        this.products = page.products;
        this.total = page.totalCount;
      });
  }

  refresh(state: ClrDatagridStateInterface) {
    const skip = state.page.from > 0 ? state.page.from : undefined;
    this.dataService.setPagination(state.page.size, skip);
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }
}
