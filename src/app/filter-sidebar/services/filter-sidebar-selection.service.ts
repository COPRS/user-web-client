import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductAttribute } from 'src/app/services/models/ProductAttribute';
import { AttributeQueryParameter } from '../models/AttributeQuery';

@Injectable({
  providedIn: 'root',
})
export class FilterSidebarSelectionService {
  private selectedMissionName$: BehaviorSubject<string> = new BehaviorSubject(
    undefined
  );

  private selectedProductType$: BehaviorSubject<string> = new BehaviorSubject(
    undefined
  );

  // Attribute persistance
  private selectedAttributes$: BehaviorSubject<Array<ProductAttribute>> =
    new BehaviorSubject([]);
  private selectedAttributes: Array<ProductAttribute> = [];

  // Attribute query persistance
  private attributeQuery$: BehaviorSubject<Array<AttributeQueryParameter>> =
    new BehaviorSubject([]);
  private attributeQuery: Array<AttributeQueryParameter> = [];

  constructor() {}

  // MissionName Methods
  public getMissionName(): Observable<string> {
    return this.selectedMissionName$.asObservable();
  }
  public setMissionName(missionName: string): void {
    this.selectedMissionName$.next(missionName);
    this.resetProductType();
  }
  public resetMissionName(): void {
    this.selectedMissionName$.next(undefined);
  }

  // ProductType Methods
  public getProductType(): Observable<string> {
    return this.selectedProductType$.asObservable();
  }
  public setProductType(productType: string): void {
    this.selectedProductType$.next(productType);
  }
  public resetProductType(): void {
    this.selectedProductType$.next(undefined);
  }

  // Selected Attribute Methods
  // TODO: do not show already added attributes in available attributes
  public getSelectedAttributes(): Observable<Array<ProductAttribute>> {
    return this.selectedAttributes$.asObservable();
  }
  public addSelectedAttribute(attribute: ProductAttribute): void {
    this.selectedAttributes.push(attribute);
    this.selectedAttributes$.next(this.selectedAttributes);
  }
  public removeSelectedAttribute(attributeName: string): void {
    const indexToRemove = this.selectedAttributes.findIndex(
      (e) => e.name == attributeName
    );
    if (indexToRemove >= 0) {
      this.selectedAttributes.splice(indexToRemove, 1);
      this.selectedAttributes$.next(this.selectedAttributes);
    }

    this.removeAttributeQuery(attributeName);
  }
  public resetSelectedAttributes(): void {
    this.selectedAttributes = [];
    this.selectedAttributes$.next(this.selectedAttributes);
  }

  // Query Methods
  public addAttributeQuery(attributeQuery: AttributeQueryParameter): void {
    this.attributeQuery.push(attributeQuery);
    this.attributeQuery$.next(this.attributeQuery);
  }

  public removeAttributeQuery(attributeName: string): void {
    this.attributeQuery = this.attributeQuery.filter(
      (e) => e.attributeName !== attributeName
    );
    this.attributeQuery$.next(this.attributeQuery);
  }

  public resetAttributeQuery(): void {
    this.attributeQuery = [];
    this.attributeQuery$.next(this.attributeQuery);
  }

  public getAttributeQuery(): Observable<Array<AttributeQueryParameter>> {
    return this.attributeQuery$;
  }
}
