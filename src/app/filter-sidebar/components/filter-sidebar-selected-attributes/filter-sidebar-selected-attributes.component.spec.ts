import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductAttribute } from 'src/app/services/models/ProductAttribute';
import { RsApiMetatdataService } from 'src/app/services/rs-api-metatdata.service';
import { FilterSidebarSelectedAttributesComponent } from './filter-sidebar-selected-attributes.component';

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

describe('FilterSidebarSelectedAttributesComponent', () => {
  let component: FilterSidebarSelectedAttributesComponent;
  let fixture: ComponentFixture<FilterSidebarSelectedAttributesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterSidebarSelectedAttributesComponent],
      providers: [
        FilterSidebarSelectedAttributesComponent,
        { provide: RsApiMetatdataService, useClass: MockRsApiMetatdataService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSidebarSelectedAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
