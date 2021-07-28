import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import Map from 'ol/Map';

import { MapComponent } from './map.component';

class MockMap {
  public setTarget() {
    return;
  }
}

class MockElementRef {
  nativeElement = '';
}

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        MapComponent,
        { provide: ElementRef, useClass: MockElementRef },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    component.map = new MockMap() as Map;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
