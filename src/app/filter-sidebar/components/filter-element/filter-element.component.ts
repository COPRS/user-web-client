import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { IAppFilterConfigValueType } from 'src/app/services/models/IAppConfig';
import { FilterElement } from '../../models/FilterElement';

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

  operatorSuggestions = [
    'contains',
    'endswith',
    'eq',
    'ge',
    'gt',
    'le',
    'lt',
    'startswith',
  ];
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
    this.setValueType(this.attributeName);
    if (this.attributeName && this.operator && (this.value || this.dateValue)) {
      this.changed.emit({
        attributeName: this.attributeName,
        operator: this.operator,
        value: this.value,
      });
    }
  }

  setValueType(attributeName: string) {
    if (attributeName) {
      const fieldFilterType = this.configService.settings.filterConfig?.find(
        (f) => f.attributeName === attributeName
      );
      this.valueType = fieldFilterType ? fieldFilterType.valueType : undefined;
    }
  }
}
