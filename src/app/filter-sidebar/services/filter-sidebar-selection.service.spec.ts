import { TestBed } from '@angular/core/testing';
import { FilterSidebarSelectionService } from './filter-sidebar-selection.service';
import { take } from 'rxjs/operators';
import { RsApiMetatdataService } from 'src/app/services/rs-api-metatdata.service';
import { ProductAttribute } from 'src/app/services/models/ProductAttribute';

class MockRsApiMetatdataService {
  getMissions(): Promise<String[]> {
    return Promise.resolve(['m1', 'm2']);
  }
  getAttributes(): Promise<ProductAttribute[]> {
    return Promise.resolve([
      {
        id: 'attr_some_attr1_some_datatype1',
        name: 'some_attr1',
        dataType: 'some_datatype1',
      },
    ]);
  }
}

describe('FilterSidebarSelectionService', () => {
  let service: FilterSidebarSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FilterSidebarSelectionService,
        { provide: RsApiMetatdataService, useClass: MockRsApiMetatdataService },
      ],
    });
    service = TestBed.inject(FilterSidebarSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // MissionName Tests
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

  // ProductType Tests
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

  // Available Attributes Tests
  it('should get no attributes when missionName is not selected', async () => {
    service.setProductType('some_prod_typ');
    let attributes = await service
      .getAvailableAttributes()
      .pipe(take(1))
      .toPromise();
    expect(attributes).toEqual(undefined);
  });

  it('should get no attributes when productType is not selected', async () => {
    service.setMissionName('some_miss_name');
    let attributes = await service
      .getAvailableAttributes()
      .pipe(take(1))
      .toPromise();
    expect(attributes).toEqual(undefined);
  });

  it('should allow to get the available attributes', async () => {
    service.setMissionName('some_miss_name');
    service.setProductType('some_prod_typ');
    let attributes = await service
      .getAvailableAttributes()
      .pipe(take(1))
      .toPromise();
    expect(attributes).toEqual([
      {
        id: 'attr_some_attr1_some_datatype1',
        name: 'some_attr1',
        dataType: 'some_datatype1',
      },
    ]);
  });

  // Selected Attributes Tests
  it('should allow to set the attributes', async () => {
    service.addSelectedAttribute({
      id: 'attr_attribute1_datatype1',
      name: 'attribute1',
      dataType: 'datatype1',
    });
    service.addSelectedAttribute({
      id: 'attr_attribute2_datatype2',
      name: 'attribute2',
      dataType: 'datatype2',
    });
    const productType = await service
      .getSelectedAttributes()
      .pipe(take(1))
      .toPromise();
    expect(productType).toEqual([
      {
        id: 'attr_attribute1_datatype1',
        name: 'attribute1',
        dataType: 'datatype1',
      },
      {
        id: 'attr_attribute2_datatype2',
        name: 'attribute2',
        dataType: 'datatype2',
      },
    ]);
  });

  it('should allow to reset the selected attributes', async () => {
    service.addSelectedAttribute({
      id: 'attr_attribute1_datatype1',
      name: 'attribute1',
      dataType: 'datatype1',
    });
    service.addSelectedAttribute({
      id: 'attr_attribute2_datatype2',
      name: 'attribute2',
      dataType: 'datatype2',
    });
    let attributes = await service
      .getSelectedAttributes()
      .pipe(take(1))
      .toPromise();
    expect(attributes.length).toEqual(2);
    service.resetSelectedAttributes();
    attributes = await service
      .getSelectedAttributes()
      .pipe(take(1))
      .toPromise();
    expect(attributes).toEqual([]);
  });

  it('should allow to remove an selected attribute', async () => {
    service.addSelectedAttribute({
      id: 'attr_attribute1_datatype1',
      name: 'attribute1',
      dataType: 'datatype1',
    });
    service.addSelectedAttribute({
      id: 'attr_attribute2_datatype2',
      name: 'attribute2',
      dataType: 'datatype2',
    });
    let attributes = await service
      .getSelectedAttributes()
      .pipe(take(1))
      .toPromise();
    expect(attributes.length).toEqual(2);
    service.resetSelectedAttributes();
    attributes = await service
      .getSelectedAttributes()
      .pipe(take(1))
      .toPromise();
    expect(attributes).toEqual([]);
  });

  // Attributes Query Tests
  it('should allow to add attribute query', async () => {
    service.addAttributeQuery({
      attributeName: 'attr_attribute1_datatype1',
      operator: 'eq',
      value: 'datatype1',
    });
    let attributesQuery = await service
      .getAttributeQuery()
      .pipe(take(1))
      .toPromise();
    expect(attributesQuery.length).toEqual(1);
    service.resetSelectedAttributes();
  });

  it('should allow to remove attribute query', async () => {
    service.addAttributeQuery({
      attributeName: 'attr_attribute1_datatype1',
      operator: 'eq',
      value: 'datatype1',
    });
    let attributesQuery = await service
      .getAttributeQuery()
      .pipe(take(1))
      .toPromise();
    expect(attributesQuery.length).toEqual(1);
    service.removeAttributeQuery('attr_attribute1_datatype1');
    let attributes = await service
      .getAttributeQuery()
      .pipe(take(1))
      .toPromise();
    expect(attributes).toEqual([]);
  });

  it('should allow to remove only specified attribute query', async () => {
    service.addAttributeQuery({
      attributeName: 'attr_attribute1_datatype1',
      operator: 'eq',
      value: 'datatype1',
    });
    service.addAttributeQuery({
      attributeName: 'attr_attribute2_datatype1',
      operator: 'eq',
      value: 'datatype1',
    });
    let attributesQuery = await service
      .getAttributeQuery()
      .pipe(take(1))
      .toPromise();
    expect(attributesQuery.length).toEqual(2);
    service.removeAttributeQuery('attr_attribute1_datatype1');
    let attributes = await service
      .getAttributeQuery()
      .pipe(take(1))
      .toPromise();
    expect(attributes.length).toEqual(1);
  });

  it('should allow to reset attribute query', async () => {
    service.addAttributeQuery({
      attributeName: 'attr_attribute1_datatype1',
      operator: 'eq',
      value: 'datatype1',
    });
    service.addAttributeQuery({
      attributeName: 'attr_attribute2_datatype1',
      operator: 'eq',
      value: 'datatype1',
    });
    let attributesQuery = await service
      .getAttributeQuery()
      .pipe(take(1))
      .toPromise();
    expect(attributesQuery.length).toEqual(2);
    service.resetAttributeQuery();
    let attributes = await service
      .getAttributeQuery()
      .pipe(take(1))
      .toPromise();
    expect(attributes).toEqual([]);
  });
});
