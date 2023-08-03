import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from 'src/app/services/config.service';
import { IAppConfig } from 'src/app/services/models/IAppConfig';
import { MapSwitcherComponent } from './map-switcher.component';

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

describe('MapSwitcherComponent', () => {
  let component: MapSwitcherComponent;
  let fixture: ComponentFixture<MapSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapSwitcherComponent],
      providers: [
        MapSwitcherComponent,
        { provide: ConfigService, useClass: MockConfigService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
