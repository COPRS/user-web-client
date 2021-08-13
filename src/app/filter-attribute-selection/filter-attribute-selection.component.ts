import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SelectedMissionAndProduct } from '../filter-product-selection/SelectedMissionAndProduct';
import { RsApiMetatdataService } from '../rs-api-metatdata.service';

@Component({
  selector: 'app-filter-attribute-selection',
  templateUrl: './filter-attribute-selection.component.html',
  styleUrls: ['./filter-attribute-selection.component.scss'],
})
export class FilterAttributeSelectionComponent implements OnInit {
  constructor(private api: RsApiMetatdataService) {}

  @Input()
  selectedMissionAndProduct$: Observable<SelectedMissionAndProduct>;

  availableAttributes: String[];

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
}
