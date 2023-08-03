import { TestBed } from '@angular/core/testing';
import { ConfigService } from 'src/app/services/config.service';
import { IAppConfig } from 'src/app/services/models/IAppConfig';

import { MapViewerSelectionStylesService } from './map-viewer-selection-styles.service';
class MockConfigService {
  settings: IAppConfig = {
    apiUrl: 'http://test',
    mapBackgrounds: [
      {
        name: 'Sentinel-2 cloudless 2018 background map',
        layers: [
          {
            url: 'https://tiles.esa.maps.eox.at/wms',
            layerName: 's2cloudless_3857',
          },
        ],
      },
    ],
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
    additionalAttributes: [],
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
