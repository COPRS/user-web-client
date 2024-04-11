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

import { Injectable } from '@angular/core';
import { Feature } from 'ol';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { ConfigService } from 'src/app/services/config.service';
import { ProductSelectionService } from 'src/app/services/product-selection.service';

const defaultLineDash = [10, 0, 0, 10];
const defaultLineWidth = 3;

@Injectable({
  providedIn: 'root',
})
export class MapViewerSelectionStylesService {
  private polygonStyle: Style;
  private pointStyle: (feature: any) => any;
  private lineStyle: Style;

  private selectedStyle: Style;
  private highlightedStyle: Style;
  private highlightedAndSelectedStyle: Style;

  constructor(private configService: ConfigService) {
    this.polygonStyle = new Style({
      fill: new Fill({
        color: this.configService.settings.mapView.regionSelectionFillColor,
      }),
      stroke: new Stroke({
        color: this.configService.settings.mapView.regionSelectionStrokeColor,
        width: defaultLineWidth,
        lineDash: defaultLineDash,
      }),
    });

    this.pointStyle = (_feature) => {
      var style = new Style({
        image: new CircleStyle({
          radius: 6,
          stroke: new Stroke({
            color:
              this.configService.settings.mapView.regionSelectionStrokeColor,
            width: defaultLineWidth,
          }),
          fill: new Fill({
            color: this.configService.settings.mapView.regionSelectionFillColor,
          }),
        }),
      });
      return [style];
    };

    this.lineStyle = new Style({
      stroke: new Stroke({
        color: this.configService.settings.mapView.regionSelectionStrokeColor,
        width: defaultLineWidth,
        lineDash: defaultLineDash,
      }),
    });

    this.highlightedStyle = new Style({
      fill: new Fill({
        color: this.configService.settings.mapView.highlightFillColor,
      }),
      stroke: new Stroke({
        color: this.configService.settings.mapView.highlightStrokeColor,
        width: 6,
      }),
    });

    this.selectedStyle = new Style({
      fill: new Fill({
        color: this.configService.settings.mapView.selectionFillColor,
      }),
      stroke: new Stroke({
        color: this.configService.settings.mapView.selectionStrokeColor,
        width: 3,
      }),
    });

    this.highlightedAndSelectedStyle = this.highlightedStyle.clone();
    this.highlightedAndSelectedStyle.setFill(this.selectedStyle.getFill());
  }

  getPolygonStyle() {
    return this.polygonStyle.clone();
  }

  getPointStyle() {
    return this.pointStyle;
  }

  getLineStyle() {
    return this.lineStyle.clone();
  }

  async getSelectStyle(
    feature: Feature,
    productSelectionService: ProductSelectionService
  ): Promise<Style> {
    const product = feature.get('product');
    if (!product) {
      return Promise.resolve(undefined as any);
    }
    return new Promise((resolve, _reject) => {
      combineLatest([
        productSelectionService.getHighlightedProduct(),
        productSelectionService.getSelectedProducts(),
      ])
        .pipe(take(1))
        .subscribe(([highlighted, selectedProducts]) => {
          const productId = product.Id;
          const isCurrentHighlighted = productId === highlighted?.Id;
          const isCurrentSelected = selectedProducts?.some(
            (p) => p.Id === productId
          );
          if (isCurrentHighlighted && isCurrentSelected) {
            resolve(this.highlightedAndSelectedStyle);
          } else if (isCurrentHighlighted) {
            resolve(this.highlightedStyle);
          } else {
            resolve(this.selectedStyle);
          }
        });
    });
  }
}
