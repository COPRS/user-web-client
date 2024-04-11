/**
 * Copyright 2023 Airbus
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TestBed } from '@angular/core/testing';
import { ConfigService } from '../config.service';
import { DdipService } from './ddip.service';
import { IAppConfig } from '../models/IAppConfig';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class MockConfigService {
  settings: IAppConfig = {
    apiUrl: 'http://test:0815/Products',
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

describe('DdipService', () => {
  let service: DdipService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DdipService,
        { provide: ConfigService, useClass: MockConfigService },
      ],
    });
    service = TestBed.inject(DdipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should construct a query string', () => {
    expect(service.constructURL({ $skip: 10, $top: 99 })).toEqual(
      'http://test:0815/Products?$expand=Attributes,Quicklooks&$skip=10&$top=99'
    );
  });

  it('should construct a query string', () => {
    expect(service.constructDownloadUrl('some_productId')).toEqual(
      'http://test:0815/Products(some_productId)/$value'
    );
  });
});
