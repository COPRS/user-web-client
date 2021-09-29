import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { RsApiMetatdataService } from '../../../services/rs-api-metatdata.service';
import { SelectedMissionAndProduct } from '../../models/SelectedMissionAndProduct';
import { FilterAttributeSelectionComponent } from './filter-attribute-selection.component';

class SelectedMissionAndProductMock {
  public subscribe() {
    return;
  }
}

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
    component.selectedMissionAndProduct$ =
      new SelectedMissionAndProductMock() as Observable<SelectedMissionAndProduct>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
