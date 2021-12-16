import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryResultGridComponent } from './query-result-grid.component';

describe('QueryResultGridComponent', () => {
  let component: QueryResultGridComponent;
  let fixture: ComponentFixture<QueryResultGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryResultGridComponent ]
    })
    .compileComponents();
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
