import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { FileSizePipe } from 'src/app/filter-sidebar/query-result-grid/file-size.pipe';
import { DdipService } from 'src/app/services/ddip/ddip.service';
import { DdipProduct } from 'src/app/services/models/DdipProductResponse';
import { ProductSelectionService } from 'src/app/services/product-selection.service';
import { ProductDetailsComponent } from './product-details.component';

class MockDdipService {
  getProducts() {}
  constructorDownloadUrl() {
    return '';
  }
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

describe('DetailsSidebarComponent', () => {
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
