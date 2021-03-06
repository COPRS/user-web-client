import { TestBed } from '@angular/core/testing';
import { ConfigService } from 'src/app/services/config.service';
import { IAppConfig } from 'src/app/services/models/IAppConfig';
import { MapSwitcherService } from './map-switcher.service';

class MockConfigService {
  settings: IAppConfig = {
    apiUrl: 'http://test',
    mapBackgrounds: [],
    keycloak: { clientId: '', realm: '', url: '' },
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
