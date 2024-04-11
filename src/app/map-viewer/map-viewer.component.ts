/**
 * Copyright 2023 Airbus
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Feature } from 'ol';
import { Zoom } from 'ol/control';
import GeoJSON from 'ol/format/GeoJSON';
import Geometry from 'ol/geom/Geometry';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import { DoubleClickZoom, Draw, Extent } from 'ol/interaction';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Map from 'ol/Map';
import { transformExtent } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import View from 'ol/View';
import { Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { FilterSidebarNavigationService } from '../filter-sidebar/services/filter-sidebar-navigation.service';
import { QueryResultService } from '../filter-sidebar/services/query-result.service';
import { ProductSelectionService } from '../services/product-selection.service';
import { configureMapHighlight } from './map-viewer-logic';
import {
  MapRegionSelection,
  MapRegionSelectionService,
  SelectionType,
} from './services/map-region-selection.service';
import {
  AvailableMap,
  MapSwitcherService,
} from './services/map-switcher.service';
import { MapViewerSelectionStylesService } from './services/map-viewer-selection-styles.service';
import * as splitGeoJSON from 'geojson-antimeridian-cut';
import { MapViewerService } from './services/map-viewer.service';
import { SimpleGeometry } from 'ol/geom';

const SOURCE_PROJECTION = 'EPSG:4326';
const DESTINATION_PROJECTION = 'EPSG:3857';

@Component({
  selector: 'app-map-viewer',
  templateUrl: './map-viewer.component.html',
  styleUrls: ['./map-viewer.component.scss'],
})
export class MapViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  private map: Map;
  //private bounds = [-180, -89, 180, 89];
  private bounds = [-180, -84, 180, 84];

  private readonly onDestroy = new Subject<void>();
  private source = new VectorSource();
  private draw: Draw;
  private drawType: SelectionType;

  constructor(
    private productSelectionService: ProductSelectionService,
    private elementRef: ElementRef,
    private mapSwitcher: MapSwitcherService,
    private queryResultService: QueryResultService,
    private mapRegionSelectionService: MapRegionSelectionService,
    private mapViewerSelectionStylesService: MapViewerSelectionStylesService,
    private filterSidebarNavigationService: FilterSidebarNavigationService,
    private mapViewerService: MapViewerService
  ) {}
  async ngAfterViewInit() {
    this.map.setTarget(this.elementRef.nativeElement);
    this.mapSwitcher
      .getSelectedMap()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((e) => this.changeMapBackground(e));
    this.mapRegionSelectionService
      .getSelection()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((e) => this.changeMapRegionSelectionLayer(e));
  }

  private changeMapBackground(selectedMap: AvailableMap) {
    // Remove old background if it exists
    const backgroundLayers = this.map
      .getLayers()
      .getArray()
      .filter((l) => {
        if (l) {
          const props = l.getProperties();
          if (props.layerType === LayerType.Background) {
            return true;
          }
        }
        return false;
      });
    backgroundLayers.forEach((l) => {
      this.map.removeLayer(l);
    });

    // Set new background
    selectedMap.sources.forEach((source) => {
      this.map.addLayer(
        new TileLayer({
          zIndex: 0,
          properties: {
            layerType: LayerType.Background,
            layerName: selectedMap.mapName,
          },
          source,
          extent: transformExtent(
            this.bounds,
            SOURCE_PROJECTION,
            DESTINATION_PROJECTION
          ),
        })
      );
    });
  }

  private changeMapRegionSelectionLayer(selection?: MapRegionSelection) {
    // Remove old selection layer if it exists
    const backgroundLayers = this.map
      .getLayers()
      .getArray()
      .filter((l) => {
        if (l) {
          const props = l.getProperties();
          if (props.layerType === LayerType.Selection) {
            return true;
          }
        }
        return false;
      });
    backgroundLayers.forEach((l) => {
      this.map.removeLayer(l);
    });

    // Set new background
    // Add data layer with new data
    if (selection) {
      let geometry: Geometry;
      let style: Style | any;
      switch (selection.type) {
        case 'LineString':
          geometry = new LineString(selection.coordinates).transform(
            SOURCE_PROJECTION,
            DESTINATION_PROJECTION
          );
          style = this.mapViewerSelectionStylesService.getLineStyle();
          break;

        case 'Point':
          geometry = new Point(selection.coordinates[0]).transform(
            SOURCE_PROJECTION,
            DESTINATION_PROJECTION
          );
          style = this.mapViewerSelectionStylesService.getPointStyle();
          break;
        case 'Polygon':
          geometry = new Polygon([selection.coordinates]).transform(
            SOURCE_PROJECTION,
            DESTINATION_PROJECTION
          );
          style = this.mapViewerSelectionStylesService.getPolygonStyle();
          break;
      }

      this.map.addLayer(
        new VectorLayer({
          zIndex: Infinity,
          extent: transformExtent(
            this.bounds,
            SOURCE_PROJECTION,
            DESTINATION_PROJECTION
          ),
          style,
          properties: { layerType: LayerType.Selection },
          source: new VectorSource({
            features: [
              new Feature({
                geometry,
              }),
            ],
          }),
        })
      );
    }
  }

  ngOnInit(): void {
    // INIT MAP - BEGIN

    this.map = new Map({
      view: new View({
        center: [0, 0],
        zoom: 3,
        minZoom: 3,
        maxZoom: 13,
        extent: transformExtent(
          this.bounds,
          SOURCE_PROJECTION,
          DESTINATION_PROJECTION
        ),
      }),
    });

    this.map.getControls().forEach((control) => {
      if (control instanceof Zoom) {
        this.map.removeControl(control);
      }
    });
    // INIT MAP - END

    // configureMapSelect(
    //   this.map,
    //   this.productSelectionService,
    //   this.mapViewerSelectionStylesService,
    //   this.onDestroy
    // );

    configureMapHighlight(
      this.map,
      this.productSelectionService,
      this.filterSidebarNavigationService,
      this.mapViewerSelectionStylesService,
      this.onDestroy
    );

    // CREATE DRAW BOX - START
    this.mapRegionSelectionService
      .getSelectionStarted()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((type) => {
        this.startSelection(type);
      });

    this.mapRegionSelectionService
      .getSelectionAborted()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.abortSelection();
      });
    // CREATE DRAW BOX - END

    // ZOOM TO FOOTPRINT - START
    this.mapViewerService
      .getZoomToExtent()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((extent) => {
        this.zoomToExtent(extent);
      });
    // ZOOM TO FOOTPRINT - END

    // LOAD DATA FROM DDIP-API - START
    this.queryResultService
      .getFilteredProducts()
      .pipe(
        takeUntil(this.onDestroy),
        map((products) => {
          // Remove data layers
          const dataLayers = this.map
            .getLayers()
            .getArray()
            .filter((l) => {
              if (l) {
                const props = l.getProperties();
                if (props.layerType === LayerType.Data) {
                  return true;
                }
              }
              return false;
            });
          dataLayers.forEach((l) => {
            this.map.removeLayer(l);
          });

          // Convert footprints
          if (products?.products) {
            return products.products.filter((p) => p.Footprint);

            // switch lat/lon
            // features.forEach((f) => {
            //   f.Footprint?.coordinates.forEach((coordinate, idx, arr) => {
            //     arr[idx] = coordinate.map((c) => [c[1], c[0]]);
            //   });
            // });
          } else {
            return undefined;
          }
        })
      )
      .subscribe((ddipProducts) => {
        if (!ddipProducts) {
          return;
        }
        // Add data layer with new data
        this.map.addLayer(
          new VectorLayer({
            zIndex: Infinity,
            extent: transformExtent(
              this.bounds,
              SOURCE_PROJECTION,
              DESTINATION_PROJECTION
            ),

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

                  features: ddipProducts.map((product) => {
                    product.Footprint = splitGeoJSON(product.Footprint);

                    return {
                      type: 'Feature',
                      properties: { product },
                      geometry: product.Footprint,
                    };
                  }),
                },
                {
                  featureProjection: DESTINATION_PROJECTION,
                }
              ),
            }),
          })
        );
      });
    // LOAD DATA FROM DDIP-API - END

    // DISABLE ZOOM ON DOUBLECLICK - START
    this.map
      .getInteractions()
      .getArray()
      .forEach((interaction) => {
        if (interaction instanceof DoubleClickZoom) {
          this.map.removeInteraction(interaction);
        }
      });
    // DISABLE ZOOM ON DOUBLECLICK - END
  }

  private startSelection(type: SelectionType) {
    switch (type) {
      case 'LineString':
        this.draw = new Draw({
          source: this.source,
          type,
          maxPoints: 2,
          style: this.mapViewerSelectionStylesService.getLineStyle(),
        });
        break;
      case 'Polygon':
        this.draw = new Draw({
          source: this.source,
          type,
          style: this.mapViewerSelectionStylesService.getPolygonStyle(),
        });
        break;
      case 'Point':
        this.draw = new Draw({
          source: this.source,
          type,
          style: this.mapViewerSelectionStylesService.getPointStyle(),
        });
        break;
    }
    this.drawType = type;

    this.map.addInteraction(this.draw);

    this.draw.on('drawend', (drawEvent) => {
      const drawnFeature = drawEvent.feature as Feature<Polygon>;
      const geometry = drawnFeature.getGeometry();
      geometry.transform(DESTINATION_PROJECTION, SOURCE_PROJECTION);
      const coordinates = geometry.getCoordinates();
      switch (this.drawType) {
        case 'Polygon':
          this.mapRegionSelectionService.finishSelection({
            type: 'Polygon',
            coordinates: coordinates[0] as any,
          });
          break;
        case 'Point':
          this.mapRegionSelectionService.finishSelection({
            type,
            coordinates: [coordinates] as any,
          });
          break;
        case 'LineString':
          this.mapRegionSelectionService.finishSelection({
            type,
            coordinates: coordinates as any,
          });
          break;
      }

      this.abortSelection();
    });
  }

  private abortSelection() {
    if (this.draw) {
      this.draw.abortDrawing();
      this.map.removeInteraction(this.draw);
      delete this.draw;
      delete this.drawType;
    }
  }

  private zoomToExtent(extent) {
    const mapSize = this.map.getSize();
    const filterBarWidth =
      document.getElementById('side-nav-bar-menu').offsetWidth;

    const paddings = [
      mapSize[1] / 10,
      mapSize[0] / 10,
      mapSize[1] / 10,
      mapSize[0] / 10 + filterBarWidth,
    ];

    this.map.getView().fit(extent, { padding: paddings });
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }
}

export enum LayerType {
  Background = 'Background',
  Data = 'Data',
  Selection = 'Selection',
}
