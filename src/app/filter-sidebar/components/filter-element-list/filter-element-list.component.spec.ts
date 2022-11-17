import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterElementsService } from 'src/app/filter-sidebar/services/filter-elements.service';
import { FilterElementListComponent } from './filter-element-list.component';

class MockFilterElementsService {
  public getFilter() {}
}

describe('FilterElementListComponent', () => {
  let component: FilterElementListComponent;
  let fixture: ComponentFixture<FilterElementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterElementListComponent],
      providers: [
        FilterElementListComponent,
        {
          provide: FilterElementsService,
          useClass: MockFilterElementsService,
        },
      ],
    }).compileComponents();
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
