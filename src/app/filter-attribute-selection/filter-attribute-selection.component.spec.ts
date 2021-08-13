import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RsApiMetatdataService } from '../rs-api-metatdata.service';
import { FilterAttributeSelectionComponent } from './filter-attribute-selection.component';

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

describe('FilterAttributeSelectionComponent', () => {
  let component: FilterAttributeSelectionComponent;
  let fixture: ComponentFixture<FilterAttributeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterAttributeSelectionComponent],
      providers: [
        FilterAttributeSelectionComponent,
        { provide: RsApiMetatdataService, useClass: MockRsApiMetatdataService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterAttributeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
