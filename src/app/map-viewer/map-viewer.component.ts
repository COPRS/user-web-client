import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import GeoJSON from 'ol/format/GeoJSON';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Zoom } from 'ol/control';
import { fromLonLat } from 'ol/proj';
import { click } from 'ol/events/condition';
import Select from 'ol/interaction/Select';
import { RsApiService } from '../services/rs-api.service';
import { DetailsSidebarNavigationService } from '../details-sidebar/services/details-sidebar-navigation.service';

@Component({
  selector: 'app-map-viewer',
  templateUrl: './map-viewer.component.html',
  styleUrls: ['./map-viewer.component.scss'],
})
export class MapViewerComponent implements OnInit, AfterViewInit {
  map: Map;

  constructor(
    private detailsSideBarNav: DetailsSidebarNavigationService,
    private rsApiService: RsApiService,
    private elementRef: ElementRef
  ) {}
  ngAfterViewInit() {
    this.map.setTarget(this.elementRef.nativeElement);
  }

  ngOnInit(): void {
    // INIT MAP - BEGIN
    this.map = new Map({
      view: new View({
        center: fromLonLat([10.439822673797607, 53.25974365592727]),
        zoom: 3,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
    });

    this.map.getControls().forEach((control) => {
      if (control instanceof Zoom) {
        this.map.removeControl(control);
      }
    });
    // INIT MAP - END

    // CLICK SELECT - BEGIN
    const select = new Select({
      condition: click,
    });

    if (select !== null) {
      this.map.removeInteraction(select);
    }

    if (select !== null) {
      this.map.addInteraction(select);
      select.on('select', (e) => {
        if (e.selected.length !== 0) {
          this.detailsSideBarNav.setShowNav(e.selected[0].values_.id);
        } else {
          this.detailsSideBarNav.setShowNav(undefined);
        }
      });
    }

    this.detailsSideBarNav.getShowNav().subscribe((f) => {
      if (!f) {
        select.getFeatures().clear();
      }
    });
    // CLICK SELECT - END

    // LOAD DATA FROM RS-API - END
    this.rsApiService
      .getProducts({
        missionName: 's1',
        productType: 'L1_SLICE_ZIP',
        attributes: [
          { attributeName: 'orbitNumber', operator: 'gt', value: '4711' },
          { attributeName: 'orbitDirection', operator: 'eq', value: "'asdf'" },
        ],
      })
      .then((features) => {
        this.map.addLayer(
          new VectorLayer({
            source: new VectorSource({
              features: new GeoJSON().readFeatures(features, {
                featureProjection: 'EPSG:3857',
              }),
            }),
          })
        );
      });
    // LOAD DATA FROM RS-API - END
  }
}
