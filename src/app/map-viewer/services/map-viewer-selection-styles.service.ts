import { Injectable } from '@angular/core';
import { Feature } from 'ol';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { ConfigService } from 'src/app/services/config.service';
import { DdipProduct } from 'src/app/services/models/DdipProductResponse';
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
    const product = (feature as any).values_.product as DdipProduct;
    return new Promise((resolve, _reject) => {
      combineLatest([
        productSelectionService.getHighlightedProduct(),
        productSelectionService.getSelectedProducts(),
      ])
        .pipe(take(1))
        .subscribe(([highlighted, selectedProducts]) => {
          const isCurrentHighlighted = product.Id === highlighted?.Id;
          const isCurrentSelected = selectedProducts?.some(
            (p) => p.Id === product.Id
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
