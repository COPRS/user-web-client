import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { QueryResultService } from '../services/query-result.service';
import { QueryResultGridComponent } from './query-result-grid.component';
class MockQueryResultService {
  getFilteredProducts() {
    return new Observable();
  }
  setPagination() {}
}

describe('QueryResultGridComponent', () => {
  let component: QueryResultGridComponent;
  let fixture: ComponentFixture<QueryResultGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
