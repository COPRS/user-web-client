import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RsApiMetatdataService } from 'src/app/services/rs-api-metatdata.service';
import { ProductType } from '../../models/ProductType';
import { SelectedMissionAndProduct } from '../../models/SelectedMissionAndProduct';
import { FilterSidebarSelectionService } from '../../services/filter-sidebar-selection.service';

@Component({
  selector: 'app-filter-product-type-selection',
  templateUrl: './filter-product-type-selection.component.html',
  styleUrls: ['./filter-product-type-selection.component.scss'],
})
export class FilterProductTypeSelectionComponent implements OnInit {
  constructor(
    private rsMetadataApi: RsApiMetatdataService,
    private selectionService: FilterSidebarSelectionService
  ) {}

  ngOnInit(): void {
    this.rsMetadataApi.getMissionNames().then(async (missions) => {
      this.availableMissions = missions;
      for (const m in missions) {
        const cur_mission = missions[m];

        let productTypes = await this.rsMetadataApi.getProductTypes(
          cur_mission
        );

        this.availableProductTypes.push({
          missionName: cur_mission,
          productTypes,
        });
      }
    });
  }

  public availableMissions: String[] = [];
  public availableProductTypes: ProductType[] = [];

  public selectedMission: String;

  public missionNameChanged(event) {
    this.selectedMission = event.target.value;
    if (this.selectedMission) {
      this.productTypes = this.availableProductTypes.find(
        (pt) => pt.missionName == this.selectedMission
      ).productTypes;
      this.selectionService.setMissionName(this.selectedMission);
    } else {
      this.selectionService.resetMissionName();
    }
  }

  public productTypeChanged(event) {
    this.selectedProductType = event.target.value;
    if (this.selectedProductType) {
      this.selectionService.setProductType(this.selectedProductType);
    } else {
      this.selectionService.resetProductType();
    }
  }

  public productTypes: String[];
  public selectedProductType: String = '';
}
