import { TestBed } from '@angular/core/testing';
import { DdipService } from 'src/app/services/ddip.service';
import { QueryResultService } from './query-result.service';

class MockDdipService {
  getExampleProducts() {}
  getExampleProductsCount() {}
}

describe('QueryResultService', () => {
  let service: QueryResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        QueryResultService,
        { provide: DdipService, useClass: MockDdipService },
      ],
    });
    service = TestBed.inject(QueryResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
