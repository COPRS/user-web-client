/**
 * Copyright 2023 Airbus
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PRODUCT_TYPE_EXTENDED_ATTRIBUTE_NAME } from 'src/app/filter-sidebar/components/filter-element/filter-element.component';
import { PaginationConfig } from '../../filter-sidebar/services/query-result.service';
import { ConfigService } from '../config.service';
import {
  DdipProduct,
  DdipProductRawFromPrip,
  DdipProductResponse,
} from '../models/DdipProductResponse';
import { OdataQuery } from './DdipQuery';

@Injectable({
  providedIn: 'root',
})
export class DdipService {
  constructor(private config: ConfigService, private http: HttpClient) {}

  async getProducts(
    filter: string,
    pageConfig: PaginationConfig
  ): Promise<DdipProductResponse<DdipProduct>> {
    const query = {
      $format: 'json',
      $count: true,
    } as OdataQuery;
    if (pageConfig.page) {
      query.$skip = (pageConfig.page - 1) * pageConfig.pageSize;
    }
    if (pageConfig.pageSize) {
      query.$top = pageConfig.pageSize;
    }
    if (filter) {
      query.$filter = filter;
    }

    return await this.http
      .get<DdipProductResponse<DdipProductRawFromPrip>>(
        this.constructURL(query)
      )
      .pipe(
        map((e) => ({
          '@odata.context': e['@odata.context'],
          '@odata.count': e['@odata.count'],
          value: this.mapDdipProductRawFromPripToDdipProductRaw(e.value),
        }))
      )
      .toPromise();
  }

  constructURL(query: OdataQuery): string {
    let queryString: string[] = [];
    Object.keys(query).forEach((p) => {
      queryString.push(`${p}=${query[p]}`);
    });
    return (
      this.config.settings.apiUrl +
      '?$expand=Attributes,Quicklooks&' +
      queryString.join('&')
    );
  }

  constructDownloadUrl(productId: string): string {
    return this.config.settings.apiUrl + `(${productId})/$value`;
  }

  constructQuicklookUrl(productId: string, quicklookImageName: string): string {
    return (
      this.config.settings.apiUrl +
      `(${productId})/Quicklooks('${quicklookImageName}')/$value`
    );
  }

  private mapDdipProductRawFromPripToDdipProductRaw(
    ddipProductsRaw: DdipProductRawFromPrip[]
  ): DdipProduct[] {
    return ddipProductsRaw.map((e): DdipProduct => {
      const productType = e.StringAttributes?.filter(
        (n) => n.Name === PRODUCT_TYPE_EXTENDED_ATTRIBUTE_NAME
      )[0];

      return {
        '@odata.mediaContentType': e['@odata.mediaContentType'],
        Id: e.Id,
        Name: e.Name,
        ContentType: e.ContentType,
        ContentLength: e.ContentLength,
        PublicationDate: e.PublicationDate,
        EvictionDate: e.EvictionDate,
        Checksum: e.Checksum,
        ProductionType: e.ProductionType,
        ProductType: productType ? (productType.Value as string) : undefined,
        ContentDate: e.ContentDate,
        Footprint: e.Footprint,
        Quicklooks: e.Quicklooks.map((q) =>
          this.constructQuicklookUrl(e.Id, q.Image)
        ),
        ExtendedAttributes: [
          ...e.BooleanAttributes,
          ...e.DateTimeOffsetAttributes,
          ...e.DoubleAttributes,
          ...e.IntegerAttributes,
          ...e.StringAttributes,
        ],
      };
    });
  }
}
