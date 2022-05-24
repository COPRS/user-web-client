import { Injectable } from '@angular/core';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import { ConfigService } from 'src/app/services/config.service';

const defaultLineDash = [10, 0, 0, 10];
const defaultLineWidth = 3;

@Injectable({
  providedIn: 'root',
})
export class MapViewerSelectionStylesService {
  private polygonStyle: Style;
  private pointStyle: (feature: any) => any;
  private lineStyle: Style;

  constructor(private configService: ConfigService) {
    this.polygonStyle = new Style({
      fill: new Fill({
        color: this.configService.settings.mapView.selectionFillColor,
      }),
      stroke: new Stroke({
        color: this.configService.settings.mapView.selectionStrokeColor,
        width: defaultLineWidth,
        lineDash: defaultLineDash,
      }),
    });

    this.pointStyle = (_feature) => {
      var style = new Style({
        image: new CircleStyle({
          radius: 6,
          stroke: new Stroke({
            color: this.configService.settings.mapView.selectionStrokeColor,
            width: defaultLineWidth,
          }),
          fill: new Fill({
            color: this.configService.settings.mapView.selectionFillColor,
          }),
        }),
      });
      return [style];
    };

    this.lineStyle = new Style({
      stroke: new Stroke({
        color: this.configService.settings.mapView.selectionStrokeColor,
        width: defaultLineWidth,
        lineDash: defaultLineDash,
      }),
    });
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
}
