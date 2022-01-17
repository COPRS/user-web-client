import { TestBed } from '@angular/core/testing';

import { MapRegionSelectionService } from './map-region-selection.service';

describe('MapRegionSelectionService', () => {
  let service: MapRegionSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapRegionSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
