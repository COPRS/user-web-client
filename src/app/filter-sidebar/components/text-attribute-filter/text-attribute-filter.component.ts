import { Component, OnInit } from '@angular/core';
import { TextAttributeQueryParameter } from '../../models/AttributeQuery';
import { BaseAttributeFilterComponent } from '../base-attribute-filter/base-attribute-filter.component';

@Component({
  selector: 'app-text-attribute-filter',
  templateUrl: './text-attribute-filter.component.html',
  styleUrls: ['./text-attribute-filter.component.scss'],
})
export class TextAttributeFilterComponent
  extends BaseAttributeFilterComponent
  implements OnInit
{
  constructor() {
    super();
  }
  private textAttributeQueryParameter: TextAttributeQueryParameter;

  ngOnInit(): void {
    this.textAttributeQueryParameter = {
      attributeName: this.attributeName,
    } as any;
  }

  operatorChange(operator: 'startswith' | 'contains' | 'endswith') {
    this.textAttributeQueryParameter.operator = operator;
    this.queryChanged();
  }

  valueChange(event: any) {
    this.textAttributeQueryParameter.value = event.target.value;
    this.queryChanged();
  }

  private queryChanged() {
    if (
      this.textAttributeQueryParameter.operator &&
      this.textAttributeQueryParameter.value
    ) {
      this.attributeFilterChangesSubject.next([
        this.textAttributeQueryParameter,
      ]);
    }
  }
}
