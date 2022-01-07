import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../services/config.service';
import { IAppConfig } from '../services/models/IAppConfig';
import { MapViewerComponent } from './map-viewer.component';

class MockConfigService {
  settings: IAppConfig = {
    apiUrl: 'http://test',
    mapBackgrounds: [],
  };
}

describe('MapViewerComponent', () => {
  let component: MapViewerComponent;
  let fixture: ComponentFixture<MapViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapViewerComponent],
      providers: [
        MapViewerComponent,
        { provide: ConfigService, useClass: MockConfigService },
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
