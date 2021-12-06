import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterElementListComponent } from './filter-element-list.component';

describe('FilterElementListComponent', () => {
  let component: FilterElementListComponent;
  let fixture: ComponentFixture<FilterElementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterElementListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterElementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
