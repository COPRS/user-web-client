import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSidebarSelectedAttributesComponent } from './filter-sidebar-selected-attributes.component';

describe('FilterSidebarSelectedAttributesComponent', () => {
  let component: FilterSidebarSelectedAttributesComponent;
  let fixture: ComponentFixture<FilterSidebarSelectedAttributesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterSidebarSelectedAttributesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSidebarSelectedAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
