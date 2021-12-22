import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  constructor() {}

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
    return this.filterElements$.pipe(
      map(this.convertFilterElementToOdataFilter)
    );
  }

  public getFilter() {
    return this.filterElements.slice();
  }

  public getFilterCount(): Observable<number | string> {
    return this.filterElementsCounts$.asObservable();
  }

  private convertFilterElementToOdataFilter(
    filterElements: FilterElement[] | string
  ): string {
    if (typeof filterElements === 'string') {
      return filterElements;
    } else {
      let result: string[] = [];
      filterElements.forEach((filterElement) => {
        switch (filterElement.operator) {
          case 'contains':
            result.push(
              `contains(${filterElement.attributeName},'${filterElement.value}')`
            );
            break;
          case 'endswith':
            result.push(
              `endsWith(${filterElement.attributeName},'${filterElement.value}')`
            );
            break;
          case 'startswith':
            result.push(
              `startswith(${filterElement.attributeName},'${filterElement.value}')`
            );
            break;
          // case 'gt' | 'ge'|  'eq'| 'le' | 'lt':
          // handled by default
          default:
            result.push(
              `${filterElement.attributeName} ${filterElement.operator} ${filterElement.value}`
            );
            break;
        }
      });

      return result.join(' and ');
    }
  }
}
