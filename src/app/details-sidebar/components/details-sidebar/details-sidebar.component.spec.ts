import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, Observable } from 'rxjs';
import { FileSizePipe } from 'src/app/filter-sidebar/query-result-grid/file-size.pipe';
import { DdipService } from 'src/app/services/ddip/ddip.service';
import { DdipProduct } from 'src/app/services/models/DdipProductResponse';
import { DetailsSidebarNavigationService } from '../../services/details-sidebar-navigation.service';
import { DetailsSidebarComponent } from './details-sidebar.component';

class MockDdipService {
  getProducts() {}
  constructorDownloadUrl() {
    return '';
  }
}

class MockDetailsSidebarNavigationService {
  getSelectedProduct() {
    return new BehaviorSubject<DdipProduct>({
      Checksum: [{ Algorithm: 'test', ChecksumDate: '', Value: '' }],
      ContentDate: { Start: '', End: '' },
    } as any);
  }
}

describe('DetailsSidebarComponent', () => {
  let component: DetailsSidebarComponent;
  let fixture: ComponentFixture<DetailsSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailsSidebarComponent, FileSizePipe],
      providers: [
        { provide: DdipService, useClass: MockDdipService },
        {
          provide: DetailsSidebarNavigationService,
          useClass: MockDetailsSidebarNavigationService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
