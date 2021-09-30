import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RsApiService } from '../services/rs-api.service';

import { MapViewerComponent } from './map-viewer.component';

class MockRsApiService {
  getProducts() {
    return new Promise((r) => {
      return {};
    });
  }
}

describe('MapViewerComponent', () => {
  let component: MapViewerComponent;
  let fixture: ComponentFixture<MapViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapViewerComponent],
      providers: [
        MapViewerComponent,
        { provide: RsApiService, useClass: MockRsApiService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
