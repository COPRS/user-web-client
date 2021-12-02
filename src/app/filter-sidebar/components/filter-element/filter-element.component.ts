import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterElement } from '../../models/FilterElement';

@Component({
  selector: 'app-filter-element',
  templateUrl: './filter-element.component.html',
  styleUrls: ['./filter-element.component.scss'],
})
export class FilterElementComponent implements OnInit {
  constructor() {}

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
    'Attributes',
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

  value = '';

  ngOnInit(): void {
    this.attributeName = this.initFilter.attributeName;
    this.operator = this.initFilter.operator;
    this.value = this.initFilter.value;
  }

  onChange(): void {
    if (this.attributeName && this.operator && this.value) {
      this.changed.emit({
        attributeName: this.attributeName,
        operator: this.operator,
        value: this.value,
      });
    }
  }
}
