import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RsApiMetatdataService } from 'src/app/services/rs-api-metatdata.service';
import { FilterAttributeSelectionComponent } from '../filter-attribute-selection/filter-attribute-selection.component';
import { FilterSidebarComponent } from './filter-sidebar.component';

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

describe('FilterSidebarComponent', () => {
  let component: FilterSidebarComponent;
  let fixture: ComponentFixture<FilterSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [FilterSidebarComponent],
      providers: [
        FilterAttributeSelectionComponent,
        { provide: RsApiMetatdataService, useClass: MockRsApiMetatdataService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
