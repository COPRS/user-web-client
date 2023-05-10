import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { from, Observable } from 'rxjs';
import { ProductSelectionService } from 'src/app/services/product-selection.service';
import { QueryResultService } from '../services/query-result.service';
import { QueryResultGridComponent } from './query-result-grid.component';
class MockQueryResultService {
  getFilteredProducts() {
    return new Observable();
  }
  getIsLoading() {
    return from([{ loading: false }]);
  }

  getPagination() {
    return from([{ page: 1, pageSize: 100 }]);
  }

  setPagination() {}
}

class MockProductSelectionService {
  getSelectedProducts() {
    return new Observable();
  }

  getHighlightedProduct() {
    return new Observable();
  }
}

describe('QueryResultGridComponent', () => {
  let component: QueryResultGridComponent;
  let fixture: ComponentFixture<QueryResultGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [QueryResultGridComponent],
      providers: [
        // QueryResultGridComponent,
        { provide: QueryResultService, useClass: MockQueryResultService },
        {
          provide: ProductSelectionService,
          useClass: MockProductSelectionService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryResultGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
