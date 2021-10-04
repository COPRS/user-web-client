import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductAttribute } from 'src/app/services/models/ProductAttribute';
import { FilterSidebarSelectionService } from '../../services/filter-sidebar-selection.service';

@Component({
  selector: 'app-filter-sidebar-selected-attributes',
  templateUrl: './filter-sidebar-selected-attributes.component.html',
  styleUrls: ['./filter-sidebar-selected-attributes.component.scss'],
})
export class FilterSidebarSelectedAttributesComponent implements OnInit {
  constructor(private selectionService: FilterSidebarSelectionService) {}

  selectedAttributes$: Observable<ProductAttribute[]>;

  ngOnInit(): void {
    this.selectedAttributes$ = this.selectionService.getSelectedAttributes();
  }

  removeAttribute(attributeName: String) {
    this.selectionService.removeSelectedAttribute(attributeName);
  }
}
