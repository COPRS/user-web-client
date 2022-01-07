import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationConfig } from '../../filter-sidebar/services/query-result.service';
import { ConfigService } from '../config.service';
import { DdipProductResponse } from '../models/DdipProductResponse';
import { OdataQuery } from './DdipQuery';

@Injectable({
  providedIn: 'root',
})
export class DdipService {
  constructor(private config: ConfigService, private http: HttpClient) {}

  async getProducts(
    filter: string,
    pageConfig: PaginationConfig
  ): Promise<DdipProductResponse> {
    const query = {
      $format: 'json',
      $count: true,
    } as OdataQuery;
    if (pageConfig.skip) {
      query.$skip = pageConfig.skip;
    }
    if (pageConfig.top) {
      query.$top = pageConfig.top;
    }
    if (filter) {
      query.$filter = filter;
    }

    const res = await this.http
      .get<DdipProductResponse>(this.constructURL(query))
      .toPromise();

    return res;
  }

  constructURL(query: OdataQuery): string {
    let queryString: string[] = [];
    Object.keys(query).forEach((p) => {
      queryString.push(`${p}=${query[p]}`);
    });
    return this.config.settings.apiUrl + '?' + queryString.join('&');
  }
}
