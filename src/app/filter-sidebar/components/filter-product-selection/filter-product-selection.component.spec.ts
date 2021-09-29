import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RsApiMetatdataService } from 'src/app/services/rs-api-metatdata.service';
import { FilterProductSelectionComponent } from './filter-product-selection.component';

class MockRsApiMetatdataService {
  getMissions() {
    return new Promise((r) => {
      return {
        missions: {
          missions: ['m1', 'm2'],
        },
      };
    });
  }
}

describe('FilterProductSelectionComponent', () => {
  let component: FilterProductSelectionComponent;
  let fixture: ComponentFixture<FilterProductSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterProductSelectionComponent],
      providers: [
        FilterProductSelectionComponent,
        { provide: RsApiMetatdataService, useClass: MockRsApiMetatdataService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterProductSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
