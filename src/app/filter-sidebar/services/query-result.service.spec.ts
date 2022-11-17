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
