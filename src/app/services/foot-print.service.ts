import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FootPrintService {
  constructor() {}

  public getSimplePoints(): Promise<any> {
    return new Promise((r) => r(this.simplePoints));
  }

  private simplePoints = {
    type: 'FeatureCollection',
    crs: {
      type: 'name',
      properties: {
        name: 'urn:ogc:def:crs:EPSG::4326',
      },
    },
    features: [
      {
        type: 'Feature',
        properties: { Site: 'Toulouse' },
        geometry: {
          type: 'Point',
          coordinates: [1.3689136505126953, 43.54375780464834],
        },
      },
      {
        type: 'Feature',
        properties: { Site: 'Werum' },
        geometry: {
          type: 'Point',
          coordinates: [10.439822673797607, 53.25974365592727],
        },
      },
    ],
  };
}
