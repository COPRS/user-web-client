import { TestBed } from '@angular/core/testing';
import { ConfigService } from 'src/app/services/config.service';
import { IAppConfig } from 'src/app/services/models/IAppConfig';
import { MapSwitcherService } from './map-switcher.service';

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
  };
}

describe('MapSwitcherService', () => {
  let service: MapSwitcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MapSwitcherService,
        { provide: ConfigService, useClass: MockConfigService },
      ],
    });
    service = TestBed.inject(MapSwitcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
