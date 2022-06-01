import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DdipProduct } from 'src/app/services/models/DdipProductResponse';

@Injectable({
  providedIn: 'root',
})
export class ProductSelectionService {
  private selectedFeature$: BehaviorSubject<DdipProduct> =
    new BehaviorSubject<DdipProduct>(undefined);

  constructor() {}

  getSelectedProduct(): Observable<DdipProduct> {
    return this.selectedFeature$.asObservable();
  }

  setSelectedProduct(selectedFeature: DdipProduct): void {
    this.selectedFeature$.next(selectedFeature);
  }
}
