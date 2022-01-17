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
    this.onUpdated();
  }

  onUpdated(): void {
    this.filterElementsService.updateFilters(
      this.filters.filter((e) => e.attributeName && e.operator && e.value)
    );
  }
}
