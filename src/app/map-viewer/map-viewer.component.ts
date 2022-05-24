import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Feature } from 'ol';
import { Zoom } from 'ol/control';
import { click } from 'ol/events/condition';
import GeoJSON from 'ol/format/GeoJSON';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import { Draw, Select } from 'ol/interaction';
import { createRegularPolygon } from 'ol/interaction/Draw';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Map from 'ol/Map';
import { transformExtent } from 'ol/proj';
import { Vector as VectorSource } from 'ol/source';
import View from 'ol/View';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { DetailsSidebarNavigationService } from '../details-sidebar/services/details-sidebar-navigation.service';
import { QueryResultService } from '../filter-sidebar/services/query-result.service';
import {
  SELECTED_STYLE_POLYGON,
  SELECTED_STYLE_LINE,
  SELECTED_STYLE_POINT,
} from './map-viewer-selection-styles';
import {
  MapRegionSelection,
  MapRegionSelectionService,
  SelectionType,
} from './services/map-region-selection.service';
import {
  AvailableMap,
  MapSwitcherService,
} from './services/map-switcher.service';

const SOURCE_PROJECTION = 'EPSG:4326';
const DESTINATION_PROJECTION = 'EPSG:3857';

@Component({
  selector: 'app-map-viewer',
  templateUrl: './map-viewer.component.html',
  styleUrls: ['./map-viewer.component.scss'],
})
export class MapViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  private map: Map;
  private bounds = [-180, -89, 180, 89];
  private readonly onDestroy = new Subject<void>();
  private source = new VectorSource({ wrapX: false });
  private draw: Draw;
  private drawType: SelectionType;

  constructor(
    private detailsSideBarNav: DetailsSidebarNavigationService,
    private elementRef: ElementRef,
    private mapSwitcher: MapSwitcherService,
    private queryResultService: QueryResultService,
    private mapRegionSelectionService: MapRegionSelectionService
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
      .subscribe((e) => this.changeMapSelectionLayer(e));
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

  private changeMapSelectionLayer(selection: MapRegionSelection) {
    // Remove old background if it exists
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
      let geometry;
      let style;
      switch (selection.type) {
        case 'LineString':
          geometry = new LineString(selection.coordinates).transform(
            SOURCE_PROJECTION,
            DESTINATION_PROJECTION
          );
          style = SELECTED_STYLE_LINE;
          break;

        case 'Point':
          geometry = new Point(selection.coordinates[0]).transform(
            SOURCE_PROJECTION,
            DESTINATION_PROJECTION
          );
          style = SELECTED_STYLE_POINT;
          break;
        case 'Polygon':
        case 'Square':
          geometry = new Polygon([selection.coordinates]).transform(
            SOURCE_PROJECTION,
            DESTINATION_PROJECTION
          );
          style = SELECTED_STYLE_POLYGON;
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
        zoom: 1.8,
        extent: transformExtent(
          this.bounds,
          SOURCE_PROJECTION,
          DESTINATION_PROJECTION
        ),
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
          this.detailsSideBarNav.setSelectedProduct(
            e.selected[0].values_.product
          );
        } else {
          this.detailsSideBarNav.setSelectedProduct(undefined);
        }
      });
    }

    this.detailsSideBarNav
      .getSelectedProduct()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((f) => {
        if (!f) {
          select.getFeatures().clear();
        } else {
          // TODO: set feature to selected when selected from outside of the map
          this.map.getLayers().getArray();
          // .filter((l) => console.log({ l }));
        }
      });
    // CLICK SELECT - END

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

    // REACT ON SELECTED REGION - START

    // TODO: get filteresadsdasd
    // asda
    // sd

    // REACT ON SELECTED REGION - END
  }

  private startSelection(type: SelectionType) {
    switch (type) {
      case 'LineString':
        this.draw = new Draw({
          source: this.source,
          type,
          maxPoints: 2,
          style: SELECTED_STYLE_LINE,
        });
        break;
      case 'Polygon':
        this.draw = new Draw({
          source: this.source,
          type,
          style: SELECTED_STYLE_POLYGON,
        });
        break;
      case 'Point':
        this.draw = new Draw({
          source: this.source,
          type,
          style: SELECTED_STYLE_POINT as any,
        });
        break;
      case 'Square':
        this.draw = new Draw({
          source: this.source,
          type: 'Circle',
          style: SELECTED_STYLE_POLYGON,
          geometryFunction: createRegularPolygon(4),
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
        case 'Square':
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

  ngOnDestroy() {
    this.onDestroy.next();
  }
}

export enum LayerType {
  Background = 'Background',
  Data = 'Data',
  Selection = 'Selection',
}
