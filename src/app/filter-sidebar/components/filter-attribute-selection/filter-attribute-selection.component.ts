import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RsApiMetatdataService } from '../../../services/rs-api-metatdata.service';
import { ProductAttribute } from 'src/app/services/models/ProductAttribute';
import { SelectedMissionAndProduct } from '../../models/SelectedMissionAndProduct';

// TODO: base-url/api/v1/products?filter=attr1 eq value1&attr2 gt value2
@Component({
  selector: 'app-filter-attribute-selection',
  templateUrl: './filter-attribute-selection.component.html',
  styleUrls: ['./filter-attribute-selection.component.scss'],
})
export class FilterAttributeSelectionComponent implements OnInit {
  constructor(private api: RsApiMetatdataService) {}

  @Input()
  selectedMissionAndProduct$: Observable<SelectedMissionAndProduct>;

  availableAttributes: ProductAttribute[];

  async ngOnInit(): Promise<void> {
    this.selectedMissionAndProduct$.subscribe(async (m) => {
      if (m) {
        this.availableAttributes = await this.api.getAttributes(
          m.mission,
          m.productType
        );
      }
    });
  }

  chosenAttributeChanged(_attributeName) {
    // Do nothing
  }
}
