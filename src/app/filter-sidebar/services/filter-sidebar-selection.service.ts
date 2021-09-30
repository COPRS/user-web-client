import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ProductAttribute } from 'src/app/services/models/ProductAttribute';

@Injectable({
  providedIn: 'root',
})
export class FilterSidebarSelectionService {
  private selectedMissionName$: BehaviorSubject<String> = new BehaviorSubject(
    undefined
  );

  private selectedProductType$: BehaviorSubject<String> = new BehaviorSubject(
    undefined
  );

  // Attribute persistance
  private selectedAttributes$: BehaviorSubject<Array<ProductAttribute>> =
    new BehaviorSubject([]);

  private selectedAttributes: Array<ProductAttribute> = [];

  constructor() {}

  // MissionName Methods
  public getMissionName(): Observable<String> {
    return this.selectedMissionName$.asObservable();
  }
  public setMissionName(missionName: String): void {
    this.selectedMissionName$.next(missionName);
  }
  public resetMissionName(): void {
    this.selectedMissionName$.next(undefined);
  }

  // ProductType Methods
  public getProductType(): Observable<String> {
    return this.selectedProductType$.asObservable();
  }
  public setProductType(productType: String): void {
    this.selectedProductType$.next(productType);
  }
  public resetProductType(): void {
    this.selectedProductType$.next(undefined);
  }

  // Attribute Methods
  public getAttributes(): Observable<Array<ProductAttribute>> {
    return this.selectedAttributes$.asObservable();
  }
  public addAttribute(attribute: ProductAttribute): void {
    this.selectedAttributes.push(attribute);
    this.selectedAttributes$.next(this.selectedAttributes);
  }
  public removeAttribute(attributeName: String): void {
    const indexToRemove = this.selectedAttributes.findIndex(
      (e) => e.name == attributeName
    );
    if (indexToRemove) {
      this.selectedAttributes.splice(indexToRemove, 1);
      this.selectedAttributes$.next(this.selectedAttributes);
    }
  }
  public resetAttributes(): void {
    this.selectedAttributes = [];
    this.selectedAttributes$.next(this.selectedAttributes);
  }
}
