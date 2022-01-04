import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, distinct, mergeMap, tap } from 'rxjs/operators';
import { DdipService } from 'src/app/services/ddip.service';
import { DdipProduct } from 'src/app/services/models/DdipProductResponse';
import { FilterElementsService } from './filter-elements.service';

@Injectable({
  providedIn: 'root',
})
export class QueryResultService {
  private pagination$ = new BehaviorSubject<PaginationConfig>({
    top: 10,
  });
  private currentPageSubject$ = new BehaviorSubject<{
    products: DdipProduct[];
    totalCount: number;
  }>({} as any);
  private currentPage$ = combineLatest([
    this.filterService.getQuery(),
    this.pagination$,
  ]).pipe(
    distinct(),
    debounceTime(10),
    mergeMap(async (c) => {
      const [filter, pageConfig] = c;
      const result = await this.ddipService
        .getProducts(filter, pageConfig)
        .catch((e) => console.error(e));
      if (result) {
        return {
          products: result.value,
          totalCount: result['@odata.count'],
        };
      } else {
        return { products: [], totalCount: 0 };
      }
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

  public setPagination(top: number, skip?: number) {
    if (skip) {
      this.pagination$.next({ skip, top });
    } else {
      this.pagination$.next({ top });
    }
  }
}

export type PaginationConfig = { skip?: number; top: number };
