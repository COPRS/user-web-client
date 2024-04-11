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
import { FilterElementsService } from 'src/app/filter-sidebar/services/filter-elements.service';
import { DdipService } from 'src/app/services/ddip/ddip.service';
import { QueryResultService } from './query-result.service';

class MockDdipService {
  getExampleProducts() {}
  getExampleProductsCount() {}
}

class MockFilterElementsService {
  public getQuery() {}
}

describe('QueryResultService', () => {
  let service: QueryResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        QueryResultService,
        { provide: DdipService, useClass: MockDdipService },
        {
          provide: FilterElementsService,
          useClass: MockFilterElementsService,
        },
      ],
    });
    service = TestBed.inject(QueryResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
