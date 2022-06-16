import { TestBed } from '@angular/core/testing';
import { ConfigService } from 'src/app/services/config.service';
import { IAppConfig } from 'src/app/services/models/IAppConfig';

import { MapViewerSelectionStylesService } from './map-viewer-selection-styles.service';
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

describe('MapViewerSelectionStylesService', () => {
  let service: MapViewerSelectionStylesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MapViewerSelectionStylesService,
        { provide: ConfigService, useClass: MockConfigService },
      ],
    });
    service = TestBed.inject(MapViewerSelectionStylesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
