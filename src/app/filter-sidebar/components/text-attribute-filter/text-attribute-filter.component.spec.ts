import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextAttributeFilterComponent } from './text-attribute-filter.component';

describe('TextAttributeFilterComponent', () => {
  let component: TextAttributeFilterComponent;
  let fixture: ComponentFixture<TextAttributeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextAttributeFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextAttributeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
