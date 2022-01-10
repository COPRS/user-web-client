import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Zoom } from 'ol/control';
import { click } from 'ol/events/condition';
import GeoJSON from 'ol/format/GeoJSON';
import Select from 'ol/interaction/Select';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Map from 'ol/Map';
import { transformExtent } from 'ol/proj';
import { Vector as VectorSource } from 'ol/source';
import View from 'ol/View';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { DetailsSidebarNavigationService } from '../details-sidebar/services/details-sidebar-navigation.service';
import { QueryResultService } from '../filter-sidebar/services/query-result.service';
import {
  AvailableMap,
  MapSwitcherService,
} from './services/map-switcher.service';

@Component({
  selector: 'app-map-viewer',
  templateUrl: './map-viewer.component.html',
  styleUrls: ['./map-viewer.component.scss'],
})
export class MapViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  private map: Map;
  private bounds = [-180, -89, 180, 89];
  private readonly onDestroy = new Subject<void>();

  constructor(
    private detailsSideBarNav: DetailsSidebarNavigationService,
    private elementRef: ElementRef,
    private mapSwitcher: MapSwitcherService,
    private queryResultService: QueryResultService
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

    this.queryResultService
      .getFilteredProducts()
      .pipe(
        takeUntil(this.onDestroy),
        map((products) => {
          // Remove data layer
          this.map
            .getLayers()
            .getArray()
            .find((l) => {
              if (l) {
                const props = l.getProperties();
                if (props.layerType === LayerType.Data) {
                  this.map.removeLayer(l);
                }
              }
            });

          // Convert footprints
          if (products?.products) {
            const footprints = products.products
              .filter((p) => p.Footprint)
              .map((p) => {
                return { id: p.Id, footprint: p.Footprint };
              });
            return footprints;
          } else {
            return undefined;
          }
        })
      )
      .subscribe((footprints) => {
        console.log({ footprints });
        if (!footprints) {
          return;
        }
        // Add data layer with new data
        this.map.addLayer(
          new VectorLayer({
            extent: transformExtent(this.bounds, 'EPSG:4326', 'EPSG:3857'),
            properties: { layerType: LayerType.Data },
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

                  features: footprints.map((d) => {
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
      });

    // LOAD DATA FROM DDIP-API - END
  }
  ngOnDestroy() {
    this.onDestroy.next();
  }
}

export enum LayerType {
  Background = 'Background',
  Data = 'Data',
}
