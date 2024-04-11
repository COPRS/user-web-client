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
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { DdipProduct } from 'src/app/services/models/DdipProductResponse';
import { isArrayEqual } from '../util';

@Injectable({
  providedIn: 'root',
})
export class ProductSelectionService {
  private selectedProducts$: BehaviorSubject<DdipProduct[]> =
    new BehaviorSubject<DdipProduct[]>([]);
  private highlightedProduct$: BehaviorSubject<DdipProduct> =
    new BehaviorSubject<DdipProduct>(undefined);

  getSelectedProducts(): Observable<DdipProduct[]> {
    return this.selectedProducts$.pipe(distinctUntilChanged(isArrayEqual));
  }

  addSelectedProduct(newProduct: DdipProduct): void {
    this.selectedProducts$.pipe(take(1)).subscribe((ddipProducts) => {
      if (ddipProducts.every((p) => p.Id !== newProduct.Id)) {
        this.selectedProducts$.next([...(ddipProducts || []), newProduct]);
      }
    });
  }

  removeSelectedProduct(newProduct: DdipProduct): void {
    this.selectedProducts$.pipe(take(1)).subscribe((ddipProducts) => {
      this.selectedProducts$.next(
        ddipProducts.filter((p) => p.Id !== newProduct.Id)
      );
    });
  }

  clearSelectedProducts() {
    this.selectedProducts$.next([]);
  }

  setHighlightProduct(highlightedProduct: DdipProduct) {
    this.highlightedProduct$.next(highlightedProduct);
  }

  unsetHighlightProduct() {
    this.highlightedProduct$.next(undefined);
  }

  getHighlightedProduct(): Observable<DdipProduct> {
    return this.highlightedProduct$.pipe(distinctUntilChanged());
  }
}
