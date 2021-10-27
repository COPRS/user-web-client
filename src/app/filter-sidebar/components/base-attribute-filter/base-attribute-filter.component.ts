import { Component, Input, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AttributeQueryParameter } from '../../models/AttributeQuery';

@Component({ template: '' })
export class BaseAttributeFilterComponent {
  @Input()
  attributeName: string;

  @Output()
  attributeFilterChanged$: Observable<Array<AttributeQueryParameter>>;

  attributeFilterChangesSubject = new BehaviorSubject<
    Array<AttributeQueryParameter>
  >([]);

  constructor() {
    this.attributeFilterChanged$ =
      this.attributeFilterChangesSubject.asObservable();
  }
}
