import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ConfigService } from 'src/app/services/config.service';
import { DdipService } from 'src/app/services/ddip.service';
import { IAppConfig } from 'src/app/services/models/IAppConfig';
import { FilterSidebarComponent } from './filter-sidebar.component';

class MockConfigService {
  settings: IAppConfig = { apiBaseUrl: 'http://test', resourceName: 'res' };
}

class MockDdipService {
  getProducts() {}
}

describe('FilterSidebarComponent', () => {
  let component: FilterSidebarComponent;
  let fixture: ComponentFixture<FilterSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterSidebarComponent],
      providers: [
        FilterSidebarComponent,
        { provide: ConfigService, useClass: MockConfigService },
        { provide: DdipService, useClass: MockDdipService },
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [FilterSidebarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
