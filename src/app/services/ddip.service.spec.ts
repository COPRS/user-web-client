import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config.service';
import { DdipService } from './ddip.service';
import { IAppConfig } from './models/IAppConfig';

class MockConfigService {
  settings: IAppConfig = { apiBaseUrl: 'http://test', resourceName: 'res' };
}

describe('DdipService', () => {
  let service: DdipService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DdipService,
        { provide: ConfigService, useClass: MockConfigService },
      ],
    });
    service = TestBed.inject(DdipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
