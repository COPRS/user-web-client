import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductAttribute } from 'src/app/services/models/ProductAttribute';
import { FilterSidebarSelectionService } from '../../services/filter-sidebar-selection.service';

@Component({
  selector: 'app-filter-attribute-selection',
  templateUrl: './filter-attribute-selection.component.html',
  styleUrls: ['./filter-attribute-selection.component.scss'],
})
export class FilterAttributeSelectionComponent implements OnInit {
  constructor(private selectionService: FilterSidebarSelectionService) {}

  availableAttributes$: Observable<ProductAttribute[]>;

  ngOnInit(): void {
    this.availableAttributes$ = this.selectionService.getAvailableAttributes();
  }

  chosenAttributeChanged(_attributeName) {
    // Do nothing
  }
}
