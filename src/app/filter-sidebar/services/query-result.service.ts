/**
 * Copyright 2023 Airbus
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  mergeMap,
  take,
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
    pageSize: 100,
    page: 1,
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
        x[0] === y[0] &&
        x[1].pageSize === y[1].pageSize &&
        x[1].page === y[1].page
    ),
    debounceTime(10),
    mergeMap(async (c) => {
      const [filter, pageConfig] = c;
      this.isLoading$.next({ loading: true });
      let result: DdipProductResponse<DdipProduct>;
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

  public setPagination(pageSize: number, page?: number) {
    if (page) {
      this.pagination$.next({ page, pageSize });
    } else {
      this.pagination$.next({ pageSize });
    }
  }

  public getPagination() {
    return this.pagination$.pipe(take(1));
  }
}

export type PaginationConfig = { page?: number; pageSize: number };

export type LoadingStatus = {
  loading: boolean;
  error?: any;
};
