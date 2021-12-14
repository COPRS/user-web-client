import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from 'src/app/services/config.service';
import { IAppConfig } from 'src/app/services/models/IAppConfig';
import { MapSwitcherComponent } from './map-switcher.component';

class MockConfigService {
  settings: IAppConfig = {
    apiBaseUrl: 'http://test',
    resourceName: 'res',
    mapBackgrounds: [],
  };
}

describe('MapSwitcherComponent', () => {
  let component: MapSwitcherComponent;
  let fixture: ComponentFixture<MapSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapSwitcherComponent],
      providers: [
        MapSwitcherComponent,
        { provide: ConfigService, useClass: MockConfigService },
      ],
    }).compileComponents();
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
