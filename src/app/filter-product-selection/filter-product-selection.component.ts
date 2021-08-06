import { Component, OnInit } from '@angular/core';
import { ProductType } from './ProductType';

@Component({
  selector: 'app-filter-product-selection',
  templateUrl: './filter-product-selection.component.html',
  styleUrls: ['./filter-product-selection.component.scss'],
})
export class FilterProductSelectionComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  public missions: String[] = ['Sentinel 1', 'Sentinel 2', 'Sentinel 3'];
  public selectedMission: String;

  private availableProductTypes: ProductType[] = [
    {
      missionName: 'Sentinel 1',
      productTypes: [
        'S1_RAW__0S:L0_SLICE',
        'S1_RAW__0S:L0_SLICE',
        'S1_RAW__0S:L0_SLICE',
        'S1_RAW__0S:L0_SLICE',
        'S1_RAW__0S:L0_SLICE',
        'S1_RAW__0S:L0_SLICE',
      ],
    },
    {
      missionName: 'Sentinel 2',
      productTypes: [
        'S2_RAW__0S:L0_SLICE',
        'S2_RAW__0S:L0_SLICE',
        'S2_RAW__0S:L0_SLICE',
        'S2_RAW__0S:L0_SLICE',
        'S2_RAW__0S:L0_SLICE',
        'S2_RAW__0S:L0_SLICE',
      ],
    },
    {
      missionName: 'Sentinel 3',
      productTypes: [
        'S3_RAW__0S:L0_SLICE',
        'S3_RAW__0S:L0_SLICE',
        'S3_RAW__0S:L0_SLICE',
        'S3_RAW__0S:L0_SLICE',
        'S3_RAW__0S:L0_SLICE',
        'S3_RAW__0S:L0_SLICE',
      ],
    },
  ];

  public missionChanged(event) {
    this.selectedMission = event.target.value;
    console.log(event.target.value);

    this.productTypes = this.availableProductTypes.find(
      (pt) => pt.missionName == this.selectedMission
    ).productTypes;
  }

  public productTypes: String[];
  public selectedProductType: String = '';
}
