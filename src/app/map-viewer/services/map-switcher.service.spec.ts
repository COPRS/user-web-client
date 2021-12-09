import { TestBed } from '@angular/core/testing';

import { MapSwitcherService } from './map-switcher.service';

describe('MapSwitcherService', () => {
  let service: MapSwitcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapSwitcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
