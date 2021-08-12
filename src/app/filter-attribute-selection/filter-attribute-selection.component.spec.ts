import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterAttributeSelectionComponent } from './filter-attribute-selection.component';

describe('FilterAttributeSelectionComponent', () => {
  let component: FilterAttributeSelectionComponent;
  let fixture: ComponentFixture<FilterAttributeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterAttributeSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterAttributeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
