import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { IAppFilterConfigValueType } from 'src/app/services/models/IAppConfig';
import { FilterElement } from '../../models/FilterElement';

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

  attributeNameSuggestions = [
    'PublicationDate',
    'EvictionDate',
    'ContentDate/Start',
    'ContentDate/End',
    'Name',
    'ProductionType',
    'ContentLength',
  ];
  attributeName = '';

  operatorSuggestions: OperatorSuggestion[] = [];
  operator = '';

  value: string = '';
  valueType: IAppFilterConfigValueType | undefined;
  dateValue: Date | undefined;

  ngOnInit(): void {
    this.attributeName = this.initFilter.attributeName;
    this.operator = this.initFilter.operator;
    this.value = this.initFilter.value;
    this.dateValue = this.value ? new Date(this.value) : undefined;
    this.setValueType(this.attributeName);
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

  onChange(): void {
    this.valueType = this.setValueType(this.attributeName);
    this.operatorSuggestions = this.updateOperatorSuggestions(this.valueType);
    if (this.attributeName && this.operator && (this.value || this.dateValue)) {
      this.changed.emit({
        attributeName: this.attributeName,
        operator: this.operator,
        value: this.value,
      });
    }
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
