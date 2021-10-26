import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductAttribute } from 'src/app/services/models/ProductAttribute';
import { RsApiMetatdataService } from 'src/app/services/rs-api-metatdata.service';
import { FilterSidebarSelectionService } from '../../services/filter-sidebar-selection.service';

@Component({
  selector: 'app-filter-attribute-selection',
  templateUrl: './filter-attribute-selection.component.html',
  styleUrls: ['./filter-attribute-selection.component.scss'],
})
export class FilterAttributeSelectionComponent implements OnInit {
  constructor(
    private selectionService: FilterSidebarSelectionService,
    private rsMetadataService: RsApiMetatdataService
  ) {}

  availableAttributes$: Observable<ProductAttribute[]>;

  currentlyChosenAttribute: string;

  ngOnInit(): void {
    this.availableAttributes$ = this.selectionService.getAvailableAttributes();
  }

  addFilter(attributeName: string) {
    if (attributeName) {
      this.selectionService.addSelectedAttribute(
        this.rsMetadataService.splitAttributeName(attributeName)
      );
    }
  }
}
