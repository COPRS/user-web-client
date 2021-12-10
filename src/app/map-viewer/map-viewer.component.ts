import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import GeoJSON from 'ol/format/GeoJSON';
import { Stamen, Vector as VectorSource, XYZ } from 'ol/source';
import { Zoom } from 'ol/control';
import { transformExtent } from 'ol/proj';
import { click } from 'ol/events/condition';
import Select from 'ol/interaction/Select';
import { DetailsSidebarNavigationService } from '../details-sidebar/services/details-sidebar-navigation.service';
import { data } from './data';
import {
  AvailableMap,
  MapSwitcherService,
} from './services/map-switcher.service';

@Component({
  selector: 'app-map-viewer',
  templateUrl: './map-viewer.component.html',
  styleUrls: ['./map-viewer.component.scss'],
})
export class MapViewerComponent implements OnInit, AfterViewInit {
  private map: Map;
  private bounds = [-180, -89, 180, 89];

  constructor(
    private detailsSideBarNav: DetailsSidebarNavigationService,
    private elementRef: ElementRef,
    private mapSwitcher: MapSwitcherService
  ) {}
  async ngAfterViewInit() {
    this.map.setTarget(this.elementRef.nativeElement);
    this.mapSwitcher
      .getSelectedMap()
      .subscribe((e) => this.changeMapBackground(e));
  }

  private changeMapBackground(map: AvailableMap) {
    // Remove old background if exists
    this.map
      .getLayers()
      .getArray()
      .find((l) => {
        if (l) {
          const props = l.getProperties();
          if (props.layerType === LayerType.Background) {
            console.log('remove', l);
            this.map.removeLayer(l);
          }
        }
      });

    // Set new background
    map.sources.forEach((source) => {
      this.map.addLayer(
        new TileLayer({
          properties: {
            layerType: LayerType.Background,
            layerName: map.mapName,
          },
          source,
          extent: transformExtent(this.bounds, 'EPSG:4326', 'EPSG:3857'),
        })
      );
    });
  }

  ngOnInit(): void {
    // INIT MAP - BEGIN

    this.map = new Map({
      view: new View({
        center: [0, 0],
        zoom: 1.8,
        extent: transformExtent(this.bounds, 'EPSG:4326', 'EPSG:3857'),
        constrainOnlyCenter: true,
      }),
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

    // LOAD EXAMPLE DATA - START

    this.map.addLayer(
      new VectorLayer({
        zIndex: 1,
        properties: { layerType: LayerType.Data },
        extent: transformExtent(this.bounds, 'EPSG:4326', 'EPSG:3857'),
        source: new VectorSource({
          features: new GeoJSON().readFeatures(
            {
              type: 'FeatureCollection',
              crs: {
                type: 'name',
                properties: {
                  name: 'urn:ogc:def:crs:EPSG::4326',
                },
              },

              features: data.map((d) => {
                return {
                  type: 'Feature',
                  properties: { id: d.id },
                  geometry: d.footprint,
                };
              }),
            },
            {
              featureProjection: 'EPSG:3857',
            }
          ),
        }),
      })
    );

    // LOAD EXAMPLE DATA - END

    // this.map
    //   .getLayers()
    //   .forEach((layer) => console.log({ layer, props: layer.getProperties() }));
  }
}

export enum LayerType {
  Background = 'Background',
  Data = 'Data',
}
