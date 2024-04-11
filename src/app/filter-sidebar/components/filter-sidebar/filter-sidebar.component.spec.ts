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
