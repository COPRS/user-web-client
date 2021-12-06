import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import GML from 'ol/format/GML';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Zoom } from 'ol/control';
import { transformExtent } from 'ol/proj';
import { click } from 'ol/events/condition';
import Select from 'ol/interaction/Select';
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
    private elementRef: ElementRef
  ) {}
  async ngAfterViewInit() {
    this.map.setTarget(this.elementRef.nativeElement);
  }

  ngOnInit(): void {
    // INIT MAP - BEGIN
    const bounds = [-180, -89, 180, 89];
    this.map = new Map({
      view: new View({
        // center: fromLonLat([10.439822673797607, 53.25974365592727]),
        center: [0, 0],
        zoom: 1.8,
        extent: transformExtent(bounds, 'EPSG:4326', 'EPSG:3857'),
        constrainOnlyCenter: true,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
          extent: transformExtent(bounds, 'EPSG:4326', 'EPSG:3857'),
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

    // LOAD DATA FROM DDIP-API - START
    // this.ddipService.trySciHub().then((data) => {
    //   const features = data.map((e) => e.ContentGeometry);
    //   this.map.addLayer(
    //     new VectorLayer({
    //       extent: transformExtent(bounds, 'EPSG:4326', 'EPSG:3857'),
    //       source: new VectorSource({
    //         features: new GML().readFeatures(features, {
    //           featureProjection: 'EPSG:3857',
    //         }),
    //       }),
    //     })
    //   );
    // });

    // LOAD DATA FROM DDIP-API - END
  }
}
