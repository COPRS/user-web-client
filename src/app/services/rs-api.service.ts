import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Product } from './Product';

@Injectable({
  providedIn: 'root',
})
export class RsApiService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  // TODO: add filter (e.g. base-url/api/v1/products?filter=attr1 eq value1&attr2 gt value2)
  async getProducts(missionName: String, productType: String): Promise<any> {
    const a = await this.http
      .get<Array<Product>>(
        this.config.settings.rsApiBaseUrl +
          'products?missionName=' +
          missionName +
          '&productType=' +
          productType
      )
      .toPromise();

    return {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: {
          name: 'urn:ogc:def:crs:EPSG::4326',
        },
      },
      features: a.map((d) => {
        return {
          type: 'Feature',
          properties: { id: d.Id },
          geometry: d.Footprint,
        };
      }),
    };
  }
}
