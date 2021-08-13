import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductAttribute } from './ProductAttribute';

@Injectable({
  providedIn: 'root',
})
export class RsApiMetatdataService {
  private rsApiUrl = 'http://localhost:8888';

  constructor(private http: HttpClient) {}

  async getMissions(): Promise<String[]> {
    const m = await this.http
      .get(this.rsApiUrl + '/api/v1/missions')
      .toPromise<any>();
    return m.missions;
  }

  async getProductTypes(mission: String): Promise<String[]> {
    const p = await this.http
      .get(this.rsApiUrl + '/api/v1/missions/' + mission + '/productTypes')
      .toPromise<any>();
    return p.productTypes;
  }

  async getAttributes(
    mission: String,
    productType: String
  ): Promise<ProductAttribute[]> {
    const a: { attributes: String[] } = await this.http
      .get(
        this.rsApiUrl +
          '/api/v1/missions/' +
          mission +
          '/productTypes/' +
          productType +
          '/attributes'
      )
      .toPromise<any>();

    const s: ProductAttribute[] = a.attributes.map((a) => {
      const g = a.split('_');
      return { name: g[1], datatype: g[2] };
    });

    return s;
  }
}
