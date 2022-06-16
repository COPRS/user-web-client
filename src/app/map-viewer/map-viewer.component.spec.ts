import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { QueryResultService } from '../filter-sidebar/services/query-result.service';
import { ConfigService } from '../services/config.service';
import { IAppConfig } from '../services/models/IAppConfig';
import { MapViewerComponent } from './map-viewer.component';

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
  setPagination() {}
}

describe('MapViewerComponent', () => {
  let component: MapViewerComponent;
  let fixture: ComponentFixture<MapViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapViewerComponent],
      providers: [
        MapViewerComponent,
        { provide: ConfigService, useClass: MockConfigService },
        { provide: QueryResultService, useClass: MockQueryResultService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
