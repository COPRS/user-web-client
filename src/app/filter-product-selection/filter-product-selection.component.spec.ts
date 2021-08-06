import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterProductSelectionComponent } from './filter-product-selection.component';

describe('FilterProductSelectionComponent', () => {
  let component: FilterProductSelectionComponent;
  let fixture: ComponentFixture<FilterProductSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterProductSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterProductSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
