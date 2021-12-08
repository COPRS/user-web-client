import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSwitcherComponent } from './map-switcher.component';

describe('MapSwitcherComponent', () => {
  let component: MapSwitcherComponent;
  let fixture: ComponentFixture<MapSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapSwitcherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
