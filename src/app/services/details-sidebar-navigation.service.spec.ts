import { TestBed } from '@angular/core/testing';

import { DetailsSidebarNavigationService } from './details-sidebar-navigation.service';

describe('DetailsSidebarNavigationService', () => {
  let service: DetailsSidebarNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailsSidebarNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
