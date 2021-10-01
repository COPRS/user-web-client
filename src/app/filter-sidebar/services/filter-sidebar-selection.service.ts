import { Injectable } from '@angular/core';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { debounceTime, map, mergeMap, scan } from 'rxjs/operators';
import { ProductAttribute } from 'src/app/services/models/ProductAttribute';
import { RsApiMetatdataService } from 'src/app/services/rs-api-metatdata.service';

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

  constructor(private rsMetadataApi: RsApiMetatdataService) {}

  // MissionName Methods
  public getMissionName(): Observable<String> {
    return this.selectedMissionName$.asObservable();
  }
  public setMissionName(missionName: String): void {
    this.selectedMissionName$.next(missionName);
    this.resetProductType();
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

  // Available Attribute Methods
  public getAvailableAttributes(): Observable<Array<ProductAttribute>> {
    return merge(
      this.getMissionName().pipe(
        map((m) => {
          return {
            missionName: m,
          };
        })
      ),
      this.getProductType().pipe(
        map((p) => {
          return {
            productType: p,
          };
        })
      )
    )
      .pipe<{ missionName: String; productType: String }>(
        scan((acc, curr) => Object.assign({}, acc, curr), {} as any)
      )
      .pipe(debounceTime(1))
      .pipe(
        mergeMap((mp) => {
          if (mp.missionName && mp.productType) {
            return this.rsMetadataApi.getAttributes(
              mp.missionName,
              mp.productType
            );
          } else {
            return Promise.resolve(undefined);
          }
        })
      );
  }

  // Selected Attribute Methods
  public getSelectedAttributes(): Observable<Array<ProductAttribute>> {
    return this.selectedAttributes$.asObservable();
  }
  public addSelectedAttribute(attribute: ProductAttribute): void {
    this.selectedAttributes.push(attribute);
    this.selectedAttributes$.next(this.selectedAttributes);
  }
  public removeSelectedAttribute(attributeName: String): void {
    const indexToRemove = this.selectedAttributes.findIndex(
      (e) => e.name == attributeName
    );
    if (indexToRemove) {
      this.selectedAttributes.splice(indexToRemove, 1);
      this.selectedAttributes$.next(this.selectedAttributes);
    }
  }
  public resetSelectedAttributes(): void {
    this.selectedAttributes = [];
    this.selectedAttributes$.next(this.selectedAttributes);
  }
}
