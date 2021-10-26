import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductQuery } from '../filter-sidebar/models/ProductQuery';
import { ConfigService } from './config.service';
import { Product } from './models/Product';

@Injectable({
  providedIn: 'root',
})
export class RsApiService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  async getProducts(productQuery: ProductQuery): Promise<any> {
    const filter = productQuery.attributes
      .map((e) => `${e.attributeName} ${e.operator} ${e.value}`)
      .join(' AND ');
    const url =
      this.config.settings.rsApiBaseUrl +
      'missions/' +
      productQuery.missionName +
      '/productTypes/' +
      productQuery.productType +
      '/products' +
      (filter ? `?${filter}` : '');
    const a = await this.http.get<Array<Product>>(url).toPromise();
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
