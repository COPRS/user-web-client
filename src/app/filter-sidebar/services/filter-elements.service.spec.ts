import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import {
  MapRegionSelection,
  MapRegionSelectionService,
} from 'src/app/map-viewer/services/map-region-selection.service';
import { ConfigService } from 'src/app/services/config.service';
import { IAppConfig } from 'src/app/services/models/IAppConfig';
import { FilterElementsService } from './filter-elements.service';

class MockMapRegionSelectionService {
  getSelection() {
    return new BehaviorSubject<MapRegionSelection>({
      coordinates: [[10, 20]],
      type: 'Polygon',
    });
  }
}

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

describe('FilterElementsService', () => {
  let service: FilterElementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FilterElementsService,
        {
          provide: MapRegionSelectionService,
          useClass: MockMapRegionSelectionService,
        },
        { provide: ConfigService, useClass: MockConfigService },
      ],
    });
    service = TestBed.inject(FilterElementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create manual filter string', async () => {
    service.updateWithManualFilter('complete_manual_filter');
    service.getQuery().subscribe((q) => {
      expect(q).toEqual(
        "complete_manual_filter and OData.CSC.Intersects(area=geography'SRID=4326;POLYGON((10 20))')"
      );
    });
  });

  it('should create complete filter string', async () => {
    service.updateFilters([
      {
        attributeName: 'some_name',
        operator: 'contains',
        value: 'some_value',
      },
      {
        attributeName: 'some_name',
        operator: 'endswith',
        value: 'some_value',
      },
      {
        attributeName: 'some_name',
        operator: 'startswith',
        value: 'some_value',
      },
      {
        attributeName: 'some_name',
        operator: 'hassomething',
        value: 'some_value',
      },
    ]);
    service.getQuery().subscribe((q) => {
      expect(q).toEqual(
        "contains(some_name,'some_value') and endsWith(some_name,'some_value') and startswith(some_name,'some_value') and some_name hassomething 'some_value' and OData.CSC.Intersects(area=geography'SRID=4326;POLYGON((10 20))')"
      );
    });
  });
});
