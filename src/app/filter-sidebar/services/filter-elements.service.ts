import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PRODUCT_TYPE_EXTENDED_ATTRIBUTE_NAME } from 'src/app/filter-sidebar/components/filter-element/filter-element.component';
import {
  MapRegionSelection,
  MapRegionSelectionService,
} from 'src/app/map-viewer/services/map-region-selection.service';
import { ConfigService } from 'src/app/services/config.service';
import { FilterElement } from '../models/FilterElement';

@Injectable({
  providedIn: 'root',
})
export class FilterElementsService {
  private filterElements$: BehaviorSubject<Array<FilterElement> | string> =
    new BehaviorSubject([]);
  private filterElementsCounts$: BehaviorSubject<number | string> =
    new BehaviorSubject(0);
  private filterElements: Array<FilterElement> = [];

  constructor(
    private mapRegionSelectionService: MapRegionSelectionService,
    private configService: ConfigService
  ) {}

  public updateFilters(filterElements: FilterElement[]): void {
    this.filterElements = filterElements;
    this.filterElements$.next(this.filterElements);
    this.filterElementsCounts$.next(this.filterElements.length);
  }

  public updateWithManualFilter(filter: string): void {
    this.filterElements$.next(filter);
    this.filterElementsCounts$.next('*');
  }

  public getQuery(): Observable<string> {
    const filterElements = this.filterElements$.pipe(
      map((e) => this.mapSensingDateToContentDate(e)),
      map((e) => this.mapSizeUnitToActualSize(e)),
      map((e) => this.convertFilterElementToOdataFilter(e))
    );

    const regionFilter = this.mapRegionSelectionService
      .getSelection()
      .pipe(map((e) => this.convertCoordinatesToOdataFilter(e)));

    return combineLatest([filterElements, regionFilter]).pipe(
      map((e) => e.filter((f) => !!f).join(' and '))
    );
  }

  public getFilter() {
    return this.filterElements.slice();
  }

  public getFilterCount(): Observable<number | string> {
    return this.filterElementsCounts$.asObservable();
  }

  private mapSensingDateToContentDate(
    filterElements: FilterElement[] | string
  ): FilterElement[] | string {
    if (Array.isArray(filterElements)) {
      return filterElements.flatMap((fe) => {
        if (fe.attributeName === 'SensingDate' && Date.parse(fe.value)) {
          const farDate = addDays(new Date(fe.value), 1);
          return [
            { attributeName: 'ContentDate', operator: 'gt', value: fe.value },
            {
              attributeName: 'ContentDate',
              operator: 'lt',
              value: farDate.toISOString(),
            },
          ];
        } else {
          return [fe];
        }
      });
    } else {
      return filterElements;
    }
  }

  private mapSizeUnitToActualSize(filterElements: FilterElement[] | string) {
    if (Array.isArray(filterElements)) {
      return filterElements.flatMap((fe) => {
        const fieldFilterType = this.configService.settings.filterConfig?.find(
          (f) => f.attributeName === fe.attributeName
        );
        const valueType = fieldFilterType
          ? fieldFilterType.valueType
          : undefined;

        if (valueType == 'size') {
          const [, ...arr] = fe.value.match(/([\d,\.]*)([\s\S]*)/);
          const numberValue = Number.parseFloat(arr[0]);
          const unitValue = SizeUnit[arr[1]];

          return [
            {
              attributeName: fe.attributeName,
              operator: fe.operator,
              value: numberValue * unitValue + '',
            },
          ];
        } else {
          return [fe];
        }
      });
    } else {
      return filterElements;
    }
  }

  private convertFilterElementToOdataFilter(
    filterElements: FilterElement[] | string
  ): string {
    if (typeof filterElements === 'string') {
      return filterElements;
    } else {
      let result: string[] = [];
      filterElements.forEach((filterElement) => {
        if (
          filterElement.attributeName === PRODUCT_TYPE_EXTENDED_ATTRIBUTE_NAME
        ) {
          result.push(
            `Attributes/OData.CSC.StringAttribute/any(att:att/Name eq '${
              filterElement.attributeName
            }' and ${makeOperatorFilterString(
              'att/OData.CSC.StringAttribute/Value',
              filterElement.operator,
              filterElement.value,
              true
            )})`
          );
        } else {
          const currentElementFilterConfig =
            this.configService.settings.filterConfig.find(
              (e) => e.attributeName === filterElement.attributeName
            );
          let isValueStringType = true;
          if (
            currentElementFilterConfig &&
            currentElementFilterConfig.valueType !== 'string'
          ) {
            isValueStringType = false;
          }
          result.push(
            makeOperatorFilterString(
              filterElement.attributeName,
              filterElement.operator,
              filterElement.value,
              isValueStringType
            )
          );
        }
      });

      return result.join(' and ');
    }
  }

  private convertCoordinatesToOdataFilter(
    mapRegion: MapRegionSelection
  ): string {
    if (mapRegion) {
      let flattened = mapRegion.coordinates
        .map((c) => {
          return `${c[0]} ${c[1]}`;
        })
        .join(', ');
      const coordinates =
        mapRegion.type == 'Polygon'
          ? `${mapRegion.type.toUpperCase()}((${flattened}))`
          : `${mapRegion.type.toUpperCase()}(${flattened})`;

      return `OData.CSC.Intersects(area=geography'SRID=4326;${coordinates}')`;
    } else {
      return undefined;
    }
  }
}

export function makeOperatorFilterString(
  attributeName,
  operator,
  value,
  isStringType: boolean
) {
  switch (operator) {
    case 'contains':
      return `contains(${attributeName},'${value}')`;
    case 'endswith':
      return `endsWith(${attributeName},'${value}')`;
    case 'startswith':
      return `startswith(${attributeName},'${value}')`;
    // case 'gt' | 'ge'|  'eq'| 'le' | 'lt':
    // handled by default
    default:
      const val = isStringType ? "'" + value + "'" : value;
      return `${attributeName} ${operator} ${val}`;
  }
}

export function addDays(date: Date, days: number) {
  const d = new Date(date.valueOf());
  d.setDate(d.getDate() + days);
  return d;
}

export enum SizeUnit {
  B = 1,
  KB = 1000,
  MB = 1000000,
  GB = 1000000000,
}
