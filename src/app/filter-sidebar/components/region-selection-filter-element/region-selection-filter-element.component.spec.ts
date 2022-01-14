import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionSelectionFilterElementComponent } from './region-selection-filter-element.component';

describe('RegionSelectionFilterElementComponent', () => {
  let component: RegionSelectionFilterElementComponent;
  let fixture: ComponentFixture<RegionSelectionFilterElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegionSelectionFilterElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionSelectionFilterElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
