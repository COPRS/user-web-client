import { TestBed } from '@angular/core/testing';
import { ConfigService } from '../config.service';
import { DdipService } from './ddip.service';
import { IAppConfig } from '../models/IAppConfig';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class MockConfigService {
  settings: IAppConfig = {
    apiUrl: 'http://test:0815/Products',
    mapBackgrounds: [],
    keycloak: { clientId: '', realm: '', url: '' },
    mapView: { selectionFillColor: '', selectionStrokeColor: '' },
  };
}

describe('DdipService', () => {
  let service: DdipService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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

  it('should construct a query string', () => {
    expect(service.constructURL({ $skip: 10, $top: 99 })).toEqual(
      'http://test:0815/Products?$skip=10&$top=99'
    );
  });

  it('should construct a query string', () => {
    expect(service.constructorDownloadUrl('some_productId')).toEqual(
      'http://test:0815/Products(some_productId)/$value'
    );
  });
});
