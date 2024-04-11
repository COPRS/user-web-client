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

import { Component, OnInit } from '@angular/core';
import { FilterElement } from '../../models/FilterElement';
import { FilterElementsService } from '../../services/filter-elements.service';

@Component({
  selector: 'app-filter-element-list',
  templateUrl: './filter-element-list.component.html',
  styleUrls: ['./filter-element-list.component.scss'],
})
export class FilterElementListComponent implements OnInit {
  constructor(private filterElementsService: FilterElementsService) {}

  filters: Array<FilterElement> = [];

  onAddFilterClick(): void {
    this.filters.push({ attributeName: '', operator: '', value: '' });
  }

  onRemoveFilterClick(index): void {
    this.filters.splice(index, 1);
    this.onUpdated();
  }

  onFilterElementChanged(index: number, filterElement: FilterElement) {
    this.filters[index] = filterElement;
    this.onUpdated();
  }

  ngOnInit(): void {
    this.filters = this.filterElementsService.getFilter();
  }

  onUpdated(): void {
    this.filterElementsService.updateFilters(
      this.filters.filter((e) => e.attributeName && e.operator && e.value)
    );
  }
}
