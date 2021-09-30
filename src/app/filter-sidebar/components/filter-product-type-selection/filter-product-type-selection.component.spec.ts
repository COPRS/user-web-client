import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RsApiMetatdataService } from 'src/app/services/rs-api-metatdata.service';
import { FilterProductTypeSelectionComponent } from './filter-product-type-selection.component';

class MockRsApiMetatdataService {
  getMissionNames() {
    return new Promise((r) => {
      return {
        missions: {
          missions: ['m1', 'm2'],
        },
      };
    });
  }
}

describe('FilterProductTypeSelectionComponent', () => {
  let component: FilterProductTypeSelectionComponent;
  let fixture: ComponentFixture<FilterProductTypeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterProductTypeSelectionComponent],
      providers: [
        FilterProductTypeSelectionComponent,
        { provide: RsApiMetatdataService, useClass: MockRsApiMetatdataService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterProductTypeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
