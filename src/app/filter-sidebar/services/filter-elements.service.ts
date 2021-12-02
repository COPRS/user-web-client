import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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

  public getQuery(): Observable<FilterElement[]> {
    return this.filterElements$.asObservable();
  }
}
