import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  mergeMap,
} from 'rxjs/operators';
import { DdipService } from 'src/app/services/ddip/ddip.service';
import {
  DdipProduct,
  DdipProductResponse,
} from 'src/app/services/models/DdipProductResponse';
import { isArrayEqual } from 'src/app/util';
import { FilterElementsService } from './filter-elements.service';

@Injectable({
  providedIn: 'root',
})
export class QueryResultService {
  private pagination$ = new BehaviorSubject<PaginationConfig>({
    top: 10,
  });
  private isLoading$ = new BehaviorSubject<LoadingStatus>({ loading: false });
  private currentPageSubject$ = new BehaviorSubject<{
    products: DdipProduct[];
    totalCount: number;
  }>({} as any);
  private currentPage$ = combineLatest([
    this.filterService.getQuery(),
    this.pagination$,
  ]).pipe(
    distinctUntilChanged(
      (x, y) =>
        x[0] === y[0] && x[1].top === y[1].top && x[1].skip === y[1].skip
    ),
    debounceTime(10),
    mergeMap(async (c) => {
      const [filter, pageConfig] = c;
      this.isLoading$.next({ loading: true });
      let result: DdipProductResponse;
      try {
        result = await this.ddipService.getProducts(filter, pageConfig);
      } catch (error) {
        console.error('Error while quering for data', error);
        this.isLoading$.next({ loading: false, error });
        return { products: [], totalCount: 0 };
      }

      this.isLoading$.next({ loading: false });
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
    products: DdipProduct[];
    totalCount: number;
  }> {
    return this.currentPageSubject$.pipe(
      distinctUntilKeyChanged('products', isArrayEqual)
    );
  }

  public getIsLoading(): Observable<LoadingStatus> {
    return this.isLoading$.asObservable();
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

export type LoadingStatus = {
  loading: boolean;
  error?: any;
};
