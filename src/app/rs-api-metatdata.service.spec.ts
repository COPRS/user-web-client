import { TestBed } from '@angular/core/testing';

import { RsApiMetatdataService } from './rs-api-metatdata.service';

describe('RsApiMetatdataService', () => {
  let service: RsApiMetatdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RsApiMetatdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});