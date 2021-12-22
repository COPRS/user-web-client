import { Injectable } from '@angular/core';
import { o } from 'odata';
import { __param } from 'tslib';
import { PaginationConfig } from '../filter-sidebar/services/query-result.service';
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

  getExampleProducts(filter: string, pageConfig: PaginationConfig) {
    if ((pageConfig.skip || pageConfig.skip >= 0) && top) {
      return testData.products.slice(
        pageConfig.skip,
        pageConfig.skip + pageConfig.top
      );
    } else {
      return testData.products;
    }
  }

  getExampleProductsCount(filter: string) {
    console.log('getExampleProductsCount()');
    return testData.products.length;
  }
}

export interface DdipResponse {
  ContentGeometry: string;
}
