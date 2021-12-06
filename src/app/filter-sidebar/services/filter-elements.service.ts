import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FilterElement } from '../models/FilterElement';

@Injectable({
  providedIn: 'root',
})
export class FilterElementsService {
  private filterElements$: BehaviorSubject<Array<FilterElement>> =
    new BehaviorSubject([]);
  private filterElements: Array<FilterElement> = [];

  constructor() {}

  public updateFilters(filterElements: FilterElement[]): void {
    this.filterElements = filterElements;
    this.filterElements$.next(this.filterElements);
  }

  public getQuery(): Observable<string> {
    return this.filterElements$.pipe(
      map(this.convertFilterElementToOdataFilter)
    );
  }

  private convertFilterElementToOdataFilter(
    filterElements: FilterElement[]
  ): string {
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
