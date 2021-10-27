import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseAttributeFilterComponent } from './base-attribute-filter.component';

describe('BaseAttributeFilterComponent', () => {
  let component: BaseAttributeFilterComponent;
  let fixture: ComponentFixture<BaseAttributeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseAttributeFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseAttributeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
