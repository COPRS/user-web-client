import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from 'src/app/services/config.service';
import { IAppConfig } from 'src/app/services/models/IAppConfig';
import { FilterElementComponent } from './filter-element.component';

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

describe('FilterElementComponent', () => {
  let component: FilterElementComponent;
  let fixture: ComponentFixture<FilterElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterElementComponent],
      providers: [
        FilterElementComponent,
        { provide: ConfigService, useClass: MockConfigService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
