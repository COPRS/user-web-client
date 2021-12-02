import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
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
    console.log('updateFilters', this.filterElements);
  }

  public getQuery(): Observable<string[]> {
    return this.filterElements$.pipe(
      tap((e) => console.log(e)),
      map(this.convertFilterElementToOdataFilter),
      tap((e) => console.log(e))
    );
  }

  private convertFilterElementToOdataFilter(
    filterElements: FilterElement[]
  ): string[] {
    let result: string[] = [];
    console.log('asdasdasd', filterElements);
    filterElements.forEach((filterElement) => {
      console.log(filterElement.operator);
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
        case 'eq':
          result.push(filterElement.operator);
          break;
        case 'ge':
          result.push(filterElement.operator);
          break;
        // case 'gt':
        // handled by default
        // break;
        case 'le':
          result.push(filterElement.operator);
          break;
        case 'lt':
          result.push(filterElement.operator);
          break;
        case 'startswith':
          result.push(
            `startswith(${filterElement.attributeName},'${filterElement.value}')`
          );
          break;

        default:
          result.push(
            `${filterElement.attributeName} ${filterElement.operator} ${filterElement.value}`
          );
          break;
      }
    });

    return result;
  }
}
