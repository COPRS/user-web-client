import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, distinct, map } from 'rxjs/operators';
import { DdipService } from 'src/app/services/ddip.service';
import { FilterElementsService } from './filter-elements.service';

@Injectable({
  providedIn: 'root',
})
export class QueryResultService {
  private pagination$ = new BehaviorSubject<PaginationConfig>({
    skip: 0,
    top: 10,
  });
  private currentPageSubject$ = new BehaviorSubject<{
    products: any[];
    totalCount: number;
  }>({} as any);
  private currentPage$ = combineLatest([
    this.filterService.getQuery(),
    this.pagination$,
  ]).pipe(
    distinct(),
    debounceTime(10),
    map((c) => {
      const [filter, pageConfig] = c;
      return {
        products: this.ddipService.getExampleProducts(filter, pageConfig),
        totalCount: this.ddipService.getExampleProductsCount(filter),
      };
    })
  );

  constructor(
    private ddipService: DdipService,
    private filterService: FilterElementsService
  ) {
    this.currentPage$.subscribe(this.currentPageSubject$);
  }

  public getFilteredProducts(): Observable<{
    products: any[];
    totalCount: number;
  }> {
    return this.currentPageSubject$.asObservable();
  }

  public setPagination(skip?: number, top?: number) {
    this.pagination$.next({ skip, top });
  }
}

export type PaginationConfig = { skip: number; top: number };
