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

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { from, Observable } from 'rxjs';
import { ProductSelectionService } from 'src/app/services/product-selection.service';
import { QueryResultService } from '../services/query-result.service';
import { QueryResultGridComponent } from './query-result-grid.component';
class MockQueryResultService {
  getFilteredProducts() {
    return new Observable();
  }
  getIsLoading() {
    return from([{ loading: false }]);
  }

  getPagination() {
    return from([{ page: 1, pageSize: 100 }]);
  }

  setPagination() {}
}

class MockProductSelectionService {
  getSelectedProducts() {
    return new Observable();
  }

  getHighlightedProduct() {
    return new Observable();
  }
}

describe('QueryResultGridComponent', () => {
  let component: QueryResultGridComponent;
  let fixture: ComponentFixture<QueryResultGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [QueryResultGridComponent],
      providers: [
        // QueryResultGridComponent,
        { provide: QueryResultService, useClass: MockQueryResultService },
        {
          provide: ProductSelectionService,
          useClass: MockProductSelectionService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryResultGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
