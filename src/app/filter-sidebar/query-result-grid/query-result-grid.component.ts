import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { QueryResultService } from '../services/query-result.service';

@Component({
  selector: 'app-query-result-grid',
  templateUrl: './query-result-grid.component.html',
  styleUrls: ['./query-result-grid.component.scss'],
})
export class QueryResultGridComponent implements OnInit, OnDestroy {
  products: any[];
  total: number;
  pageSize: number = 10;
  loading: boolean = false;
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
    console.log({ skip });
    this.dataService.setPagination(state.page.size, skip);
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }
}
