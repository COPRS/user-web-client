import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { from, Observable } from 'rxjs';
import { QueryResultService } from '../services/query-result.service';
import { QueryResultGridComponent } from './query-result-grid.component';
class MockQueryResultService {
  getFilteredProducts() {
    return new Observable();
  }
  getIsLoading() {
    return from([{ loading: false }]);
  }
  setPagination() {}
}

describe('QueryResultGridComponent', () => {
  let component: QueryResultGridComponent;
  let fixture: ComponentFixture<QueryResultGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [QueryResultGridComponent],
      providers: [
        QueryResultGridComponent,
        { provide: QueryResultService, useClass: MockQueryResultService },
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
