import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductAttribute } from 'src/app/services/models/ProductAttribute';
import { AttributeQueryParameter } from '../../models/AttributeQuery';
import { FilterSidebarSelectionService } from '../../services/filter-sidebar-selection.service';

@Component({
  selector: 'app-filter-sidebar-selected-attributes',
  templateUrl: './filter-sidebar-selected-attributes.component.html',
  styleUrls: ['./filter-sidebar-selected-attributes.component.scss'],
})
export class FilterSidebarSelectedAttributesComponent implements OnInit {
  constructor(private selectionService: FilterSidebarSelectionService) {}

  selectedAttributes$: Observable<ProductAttribute[]>;
  attributeQuery$: Observable<AttributeQueryParameter[]>;

  ngOnInit(): void {
    this.selectedAttributes$ = this.selectionService.getSelectedAttributes();
    this.attributeQuery$ = this.selectionService.getAttributeQuery();
  }

  removeAttribute(attributeName: string) {
    this.selectionService.removeSelectedAttribute(attributeName);
  }

  setAttributeQuery(attributeQuery: AttributeQueryParameter[]) {
    attributeQuery.forEach((attributeQueryParameter) => {
      this.selectionService.removeAttributeQuery(
        attributeQueryParameter.attributeName
      );
    });
    attributeQuery.forEach((attributeQueryParameter) => {
      this.selectionService.addAttributeQuery(attributeQueryParameter);
    });
  }
}
