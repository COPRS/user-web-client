import { Injectable } from '@angular/core';
import { o } from 'odata';
import { ConfigService } from './config.service';
import { testData } from './testdata_prip-frontend';

@Injectable({
  providedIn: 'root',
})
export class DdipService {
  constructor(private config: ConfigService) {}

  async getProducts(filter: string): Promise<Array<DdipResponse>> {
    const g = o(this.config.settings.apiBaseUrl, {
      // headers: new Headers({
      //   Authorization: 'Basic ADD_AUTH_HERE',
      // }),
    });
    const res = await g
      .get(this.config.settings.resourceName)
      .query({ $format: 'json', $top: 5, $filter: filter });

    return res.value;
  }

  getExampleData(skip?: number, top?: number) {
    if ((skip || skip >= 0) && top) {
      return testData.products.slice(skip, skip + top);
    } else {
      return testData.products;
    }
  }
}

export interface DdipResponse {
  ContentGeometry: string;
}
