import { TestBed } from '@angular/core/testing';

import { FilterSidebarSelectionService } from './filter-sidebar-selection.service';
import { take } from 'rxjs/operators';

describe('FilterSidebarSelectionService', () => {
  let service: FilterSidebarSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterSidebarSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should allow to set the setMissionName', async () => {
    service.setMissionName('some_mission_Name');
    const missionName = await service
      .getMissionName()
      .pipe(take(1))
      .toPromise();
    expect(missionName).toEqual('some_mission_Name');
  });

  it('should allow to reset the setMissionName', async () => {
    service.setMissionName('some_mission_Name');
    let missionName = await service.getMissionName().pipe(take(1)).toPromise();
    expect(missionName).toBeTruthy();
    service.resetMissionName();
    missionName = await service.getMissionName().pipe(take(1)).toPromise();
    expect(missionName).toBeFalsy();
  });

  it('should allow to set the productType', async () => {
    service.setProductType('some_product_type');
    const productType = await service
      .getProductType()
      .pipe(take(1))
      .toPromise();
    expect(productType).toEqual('some_product_type');
  });

  it('should allow to reset the productType', async () => {
    service.setProductType('some_product_type');
    let productType = await service.getProductType().pipe(take(1)).toPromise();
    expect(productType).toBeTruthy();
    service.resetProductType();
    productType = await service.getProductType().pipe(take(1)).toPromise();
    expect(productType).toBeFalsy();
  });

  it('should allow to set the productType', async () => {
    service.setProductType('some_product_type');
    const productType = await service
      .getProductType()
      .pipe(take(1))
      .toPromise();
    expect(productType).toEqual('some_product_type');
  });

  it('should allow to set the attributes', async () => {
    service.addAttribute({ name: 'attribute1', datatype: 'datatype1' });
    service.addAttribute({ name: 'attribute2', datatype: 'datatype2' });
    const productType = await service.getAttributes().pipe(take(1)).toPromise();
    expect(productType).toEqual([
      { name: 'attribute1', datatype: 'datatype1' },
      { name: 'attribute2', datatype: 'datatype2' },
    ]);
  });

  it('should allow to reset the attributes', async () => {
    service.addAttribute({ name: 'attribute1', datatype: 'datatype1' });
    service.addAttribute({ name: 'attribute2', datatype: 'datatype2' });
    let attributes = await service.getAttributes().pipe(take(1)).toPromise();
    expect(attributes.length).toEqual(2);
    service.resetAttributes();
    attributes = await service.getAttributes().pipe(take(1)).toPromise();
    expect(attributes).toEqual([]);
  });

  it('should allow to remove an attribute', async () => {
    service.addAttribute({ name: 'attribute1', datatype: 'datatype1' });
    service.addAttribute({ name: 'attribute2', datatype: 'datatype2' });
    let attributes = await service.getAttributes().pipe(take(1)).toPromise();
    expect(attributes.length).toEqual(2);
    service.resetAttributes();
    attributes = await service.getAttributes().pipe(take(1)).toPromise();
    expect(attributes).toEqual([]);
  });
});
