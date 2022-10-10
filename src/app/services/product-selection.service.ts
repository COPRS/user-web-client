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
