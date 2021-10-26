import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { ProductAttribute } from './models/ProductAttribute';

@Injectable({
  providedIn: 'root',
})
export class RsApiMetatdataService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  async getMissionNames(): Promise<string[]> {
    const m = await this.http
      .get(this.config.settings.rsApiBaseUrl + 'missions')
      .toPromise<any>();
    return m.missions;
  }

  async getProductTypes(mission: string): Promise<string[]> {
    const p = await this.http
      .get(
        this.config.settings.rsApiBaseUrl +
          'missions/' +
          mission +
          '/productTypes'
      )
      .toPromise<any>();
    return p.productTypes;
  }

  async getAttributes(
    missionName: string,
    productType: string
  ): Promise<ProductAttribute[]> {
    const a: { attributes: string[] } = await this.http
      .get(
        this.config.settings.rsApiBaseUrl +
          'missions/' +
          missionName +
          '/productTypes/' +
          productType +
          '/attributes'
      )
      .toPromise<any>();

    const s: ProductAttribute[] = a.attributes
      .filter((e) => e.includes('_'))
      .map(this.splitAttributeName);

    return s;
  }

  splitAttributeName(attributeName: string) {
    const g = attributeName.split('_');
    return { id: attributeName, name: g[1], dataType: g[2] };
  }
}
