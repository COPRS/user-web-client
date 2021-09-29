import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { RsApiService } from './rs-api.service';

describe('RsApiService', () => {
  let service: RsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(RsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
