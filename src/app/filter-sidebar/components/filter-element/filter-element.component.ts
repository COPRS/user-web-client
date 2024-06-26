/**
 * Copyright 2023 Airbus
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComboboxModel } from '@clr/angular/forms/combobox/model/combobox.model';
import { ConfigService } from 'src/app/services/config.service';
import { IAppFilterConfigValueType } from 'src/app/services/models/IAppConfig';
import { FilterElement } from '../../models/FilterElement';

export const PRODUCT_TYPE_EXTENDED_ATTRIBUTE_NAME = 'productType';

const OPERATOR_SUGGESTIONS: OperatorSuggestion[] = [
  { value: 'contains', description: 'contains' },
  { value: 'endswith', description: 'endswith' },
  { value: 'eq', description: 'equals (eq)' },
  { value: 'ge', description: 'greater equal (ge)' },
  { value: 'gt', description: 'greater than (gt)' },
  { value: 'le', description: 'less equal (le)' },
  { value: 'lt', description: 'less than (lt)' },
  { value: 'startswith', description: 'startswith' },
];

@Component({
  selector: 'app-filter-element',
  templateUrl: './filter-element.component.html',
  styleUrls: ['./filter-element.component.scss'],
})
export class FilterElementComponent implements OnInit {
  constructor(private configService: ConfigService) {}

  @Input() initFilter: FilterElement = {
    attributeName: '',
    operator: '',
    value: '',
  };

  @Output() changed: EventEmitter<FilterElement> = new EventEmitter();

  PRODUCT_TYPE_EXTENDED_ATTRIBUTE_NAME = PRODUCT_TYPE_EXTENDED_ATTRIBUTE_NAME;
  attributeNameSuggestions = [
    'PublicationDate',
    'EvictionDate',
    'ContentDate/Start',
    'ContentDate/End',
    'Name',
    PRODUCT_TYPE_EXTENDED_ATTRIBUTE_NAME,
    'ContentLength',
  ];
  attributeName = '';

  sizeUnitSuggestions = ['B', 'KB', 'MB', 'GB'];
  sizeUnit: string | undefined = 'B';

  operatorSuggestions: OperatorSuggestion[] = [];
  operator = '';

  value: string | boolean | number | undefined = '';
  valueType: IAppFilterConfigValueType | undefined;
  dateValue: Date | undefined;

  ngOnInit(): void {
    this.attributeName = this.initFilter.attributeName;
    this.operator = this.initFilter.operator;

    const filterType = this.updateFilterType(this.attributeName);
    if (filterType === 'date') {
      this.dateValue = this.initFilter.value
        ? new Date(this.initFilter.value)
        : undefined;
    } else if (filterType === 'boolean') {
      this.value = this.initFilter.value === 'true' ? true : false;
    } else if (
      (['long', 'double'] as IAppFilterConfigValueType[]).includes(filterType)
    ) {
      this.value = Number.parseFloat(this.initFilter.value);
    } else if (filterType === 'size' && this.initFilter.value) {
      const [, ...arr] = this.initFilter.value.match(/([\d,\.]*)([\s\S]*)/);
      this.value = arr[0];
      this.sizeUnit = arr[1];
    } else {
      this.value = this.initFilter.value;
    }
  }

  onDateChange(event: any): void {
    if (event) {
      this.value = event.toISOString();
      this.dateValue = event;
    } else {
      this.value = undefined;
      this.dateValue = undefined;
    }
    this.onChange();
  }

  onAttributeNameChange(event: ComboboxModel<any>) {
    this.attributeName = event.model;

    delete this.dateValue;
    delete this.value;
    delete this.operator;
    delete this.operatorSuggestions;
    this.onChange();
  }

  onOperatorChange(event: ComboboxModel<any>) {
    this.operator = event.model;
    this.onChange();
  }

  onSizeUnitChange(event: ComboboxModel<any>) {
    this.sizeUnit = event.model;
    this.onChange();
  }

  onChange(): void {
    this.updateFilterType(this.attributeName);

    if (this.attributeName && this.operator) {
      if (this.valueType == 'size' && this.value) {
        this.value = this.value + this.sizeUnit;
      }

      this.changed.emit({
        attributeName: this.attributeName,
        operator: this.operator,
        value: this.value?.toString(),
      });
    }
  }

  updateFilterType(attributeName: string) {
    this.valueType = this.setValueType(attributeName);
    this.operatorSuggestions = this.updateOperatorSuggestions(this.valueType);
    return this.valueType;
  }

  setValueType(attributeName: string): IAppFilterConfigValueType {
    if (attributeName) {
      const fieldFilterType = this.configService.settings.filterConfig?.find(
        (f) => f.attributeName === attributeName
      );
      return fieldFilterType ? fieldFilterType.valueType : undefined;
    } else {
      return undefined;
    }
  }

  updateOperatorSuggestions(
    valueType: IAppFilterConfigValueType
  ): OperatorSuggestion[] {
    switch (valueType) {
      case 'boolean':
        return OPERATOR_SUGGESTIONS.filter((o) =>
          (['eq'] as Operator[]).includes(o.value)
        );
      case 'string':
        return OPERATOR_SUGGESTIONS.filter((o) =>
          (['eq', 'startswith', 'endswith', 'contains'] as Operator[]).includes(
            o.value
          )
        );
      case 'date':
      case `double`:
      case 'long':
      case 'size':
        return OPERATOR_SUGGESTIONS.filter((o) =>
          (['gt', 'ge', 'lt', 'le', 'eq'] as Operator[]).includes(o.value)
        );
      default:
        return OPERATOR_SUGGESTIONS;
    }
  }
}

export interface OperatorSuggestion {
  value: Operator;
  description: string;
}

export type Operator =
  | 'contains'
  | 'endswith'
  | 'eq'
  | 'ge'
  | 'gt'
  | 'le'
  | 'lt'
  | 'startswith';
