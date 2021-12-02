import { TestBed } from '@angular/core/testing';

import { FilterElementsService } from './filter-elements.service';

describe('FilterElementsService', () => {
  let service: FilterElementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterElementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
