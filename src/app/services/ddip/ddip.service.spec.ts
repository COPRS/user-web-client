import { TestBed } from '@angular/core/testing';
import { ConfigService } from '../config.service';
import { DdipService } from './ddip.service';
import { IAppConfig } from '../models/IAppConfig';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DdipProduct } from 'src/app/services/models/DdipProductResponse';

class MockConfigService {
  settings: IAppConfig = {
    apiUrl: 'http://test:0815/Products',
    mapBackgrounds: [],
    keycloak: { clientId: '', realm: '', url: '' },
    mapView: {
      regionSelectionFillColor: '',
      regionSelectionStrokeColor: '',
      selectionFillColor: '',
      selectionStrokeColor: '',
      highlightStrokeColor: '',
      highlightFillColor: '',
    },
    filterConfig: [],
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
      'http://test:0815/Products?$expand=Attributes,Quicklooks&$skip=10&$top=99'
    );
  });

  it('should construct a query string', () => {
    expect(service.constructDownloadUrl('some_productId')).toEqual(
      'http://test:0815/Products(some_productId)/$value'
    );
  });

  it('should construct a Metalink file', () => {
    const ddipProduct: DdipProduct[] = [
      {
        '@odata.mediaContentType': 'ceont',
        Checksum: [
          { Algorithm: 'md42', ChecksumDate: '2022-01-01', Value: 'val' },
        ],
        ContentDate: { End: 'enddate', Start: 'astartdate' },
        ContentLength: 123456,
        ContentType: 'ContentType',
        EvictionDate: '',
        Footprint: { coordinates: [], crs: '', type: '' },
        Id: 'the-product-id',
        Name: 'the-file-name',
        ProductionType: 'ProductionType',
        ProductType: 'ProductType',
        PublicationDate: '',
        Quicklooks: [],
      },
    ];

    const expectedMeta4 = `<?xml version="1.0" encoding="UTF-8"?>
<metalink xmlns="urn:ietf:params:xml:ns:metalink">
  <file name="the-file-name">
    <hash type="md42">val</hash>"
    <size>123456</size>
    <url>http://test:0815/Products(the-product-id)/$value</url>
  </file>      
</metalink>`;
    expect(service.constructMetalinkDownloadfile(ddipProduct)).toEqual(
      expectedMeta4
    );
  });
});
