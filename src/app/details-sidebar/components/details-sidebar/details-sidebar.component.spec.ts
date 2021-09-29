import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsSidebarComponent } from './details-sidebar.component';

describe('DetailsSidebarComponent', () => {
  let component: DetailsSidebarComponent;
  let fixture: ComponentFixture<DetailsSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
