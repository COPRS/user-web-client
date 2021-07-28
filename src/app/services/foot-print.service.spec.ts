import { TestBed } from '@angular/core/testing';

import { FootPrintService } from './foot-print.service';

describe('FootPrintService', () => {
  let service: FootPrintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FootPrintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
