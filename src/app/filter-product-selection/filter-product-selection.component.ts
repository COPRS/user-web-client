import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RsApiMetatdataService } from '../services/rs-api-metatdata.service';
import { ProductType } from './ProductType';
import { SelectedMissionAndProduct } from './SelectedMissionAndProduct';

@Component({
  selector: 'app-filter-product-selection',
  templateUrl: './filter-product-selection.component.html',
  styleUrls: ['./filter-product-selection.component.scss'],
})
export class FilterProductSelectionComponent implements OnInit {
  constructor(private rsApi: RsApiMetatdataService) {}

  ngOnInit(): void {
    this.rsApi.getMissions().then(async (missions) => {
      this.missions = missions;
      for (const m in missions) {
        const cur_mission = missions[m];

        let productTypes = await this.rsApi.getProductTypes(cur_mission);

        this.availableProductTypes.push({
          missionName: cur_mission,
          productTypes,
        });
      }
    });
  }

  public missions: String[] = [];
  public selectedMission: String;

  public availableProductTypes: ProductType[] = [];

  @Output()
  selected = new EventEmitter<SelectedMissionAndProduct>();

  public missionChanged(event) {
    this.selectedMission = event.target.value;
    console.log('SELECTED ', event.target.value);
    if (this.selectedMission) {
      this.productTypes = this.availableProductTypes.find(
        (pt) => pt.missionName == this.selectedMission
      ).productTypes;
    }
    this.selected.emit(undefined);
  }

  public productTypeChanged(event) {
    this.selectedProductType = event.target.value;
    console.log('SELECTED ', event.target.value);
    if (this.selectedProductType) {
      this.selected.emit({
        mission: this.selectedMission,
        productType: this.selectedProductType,
      });
    } else {
      this.selected.emit(undefined);
    }
  }

  public productTypes: String[];
  public selectedProductType: String = '';
}
