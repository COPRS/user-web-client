import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { FileSizePipe } from 'src/app/filter-sidebar/query-result-grid/file-size.pipe';
import { FilterElementsService } from 'src/app/filter-sidebar/services/filter-elements.service';
import { ConfigService } from 'src/app/services/config.service';
import { DdipService } from 'src/app/services/ddip/ddip.service';
import { DdipProduct } from 'src/app/services/models/DdipProductResponse';
import { IAppConfig } from 'src/app/services/models/IAppConfig';
import { ProductSelectionService } from 'src/app/services/product-selection.service';
import { ProductDetailsComponent } from './product-details.component';
import { HttpClient } from '@angular/common/http';

class MockConfigService {
  settings: IAppConfig = {
    apiUrl: 'http://test',
    mapBackgrounds: [
      {
        name: 'Sentinel-2 cloudless 2018 background map',
        layers: [
          {
            url: 'https://tiles.esa.maps.eox.at/wms',
            layerName: 's2cloudless_3857',
          },
        ],
      },
    ],
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
    additionalAttributes: [],
  };
}

class MockDdipService {
  getProducts() {}
  constructorDownloadUrl() {
    return '';
  }
}

class MockHttp {}

class MockFilterElementsService {
  public getQuery() {}
}

class MockProductSelectionService {
  getSelectedProduct() {
    return new BehaviorSubject<DdipProduct>({
      Checksum: [{ Algorithm: 'test', ChecksumDate: '', Value: '' }],
      ContentDate: { Start: '', End: '' },
    } as any);
  }
  getHighlightedProduct() {
    return new BehaviorSubject<DdipProduct>({
      Checksum: [{ Algorithm: 'test', ChecksumDate: '', Value: '' }],
      ContentDate: { Start: '', End: '' },
    } as any);
  }
}

describe('ProductDetailsSidebarComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductDetailsComponent, FileSizePipe],
      providers: [
        { provide: DdipService, useClass: MockDdipService },
        {
          provide: ProductSelectionService,
          useClass: MockProductSelectionService,
        },
        {
          provide: FilterElementsService,
          useClass: MockFilterElementsService,
        },
        {
          provide: ConfigService,
          useClass: MockConfigService,
        },
        {
          provide: HttpClient,
          useClass: MockHttp,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
