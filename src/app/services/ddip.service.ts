import { Injectable } from '@angular/core';
import { o } from 'odata';
import { PaginationConfig } from '../filter-sidebar/services/query-result.service';
import { ConfigService } from './config.service';
import { DdipProductResponse } from './models/DdipProductResponse';

@Injectable({
  providedIn: 'root',
})
export class DdipService {
  constructor(private config: ConfigService) {}

  async getProducts(
    filter: string,
    pageConfig: PaginationConfig
  ): Promise<DdipProductResponse> {
    const g = o(this.config.settings.apiBaseUrl, {
      // headers: new Headers({
      //   Authorization: 'Basic ADD_AUTH_HERE',
      // }),
    });
    const res = await g.get(this.config.settings.resourceName).query({
      $format: 'json',
      $count: true,
      $top: pageConfig.top,
      $skip: pageConfig.skip,
      $filter: filter,
    });

    return res.value;
  }
}
