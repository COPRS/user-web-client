import { TestBed } from '@angular/core/testing';

import { ProductSelectionService } from './product-selection.service';

describe('DetailsSidebarNavigationService', () => {
  let service: ProductSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an Observable', () => {
    expect(service.getSelectedProduct).toBeTruthy();
  });

  it('isNavOpen() should return false by default', () => {
    expect(service.isNavOpen()).toBeFalsy();
  });

  it('isNavOpen() should return true when a product is selected', () => {
    service.setSelectedProduct({ Id: ' 4711', Name: 'some_name' } as any);
    expect(service.isNavOpen()).toBeTruthy();
  });
});
