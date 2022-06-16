import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { from, Observable } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { DdipService } from 'src/app/services/ddip/ddip.service';
import { IAppConfig } from 'src/app/services/models/IAppConfig';
import { QueryResultService } from '../../services/query-result.service';
import { FilterSidebarComponent } from './filter-sidebar.component';

class MockConfigService {
  settings: IAppConfig = {
    apiUrl: 'http://test',
    mapBackgrounds: [],
    keycloak: { clientId: '', realm: '', url: '' },
    mapView: {
      regionSelectionFillColor: '',
      regionSelectionStrokeColor: '',
      selectionFillColor: '',
      selectionStrokeColor: '',
      highlightStrokeColor: '',
      highlightFillColor: '',
    },
    filterConfig: [],
  };
}
class MockQueryResultService {
  getFilteredProducts() {
    return new Observable();
  }
  getIsLoading() {
    return from([{ loading: false }]);
  }
  setPagination() {}
}

class MockDdipService {
  getProducts() {}
}

describe('FilterSidebarComponent', () => {
  let component: FilterSidebarComponent;
  let fixture: ComponentFixture<FilterSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterSidebarComponent],
      providers: [
        FilterSidebarComponent,
        { provide: ConfigService, useClass: MockConfigService },
        { provide: DdipService, useClass: MockDdipService },
        { provide: QueryResultService, useClass: MockQueryResultService },
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [FilterSidebarComponent],
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
