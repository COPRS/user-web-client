import { TestBed } from '@angular/core/testing';

import { FilterSidebarNavigationService } from './filter-sidebar-navigation.service';

describe('FilterSidebarNavigationService', () => {
  let service: FilterSidebarNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterSidebarNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
