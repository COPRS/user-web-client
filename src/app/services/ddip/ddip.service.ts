import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationConfig } from '../../filter-sidebar/services/query-result.service';
import { ConfigService } from '../config.service';
import {
  DdipProduct,
  DdipProductChecksum,
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

  constructDownloadUrl(productId: string): string {
    return this.config.settings.apiUrl + `(${productId})/$value`;
  }

  constructMetalinkDownloadfile(products: DdipProduct[]): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<metalink xmlns="urn:ietf:params:xml:ns:metalink">
${products.map((p) => this.constructFileTag(p)).join('\n')}      
</metalink>`;
  }

  private constructFileTag(product: DdipProduct): string {
    return `  <file name="${product.Name}">
    ${product.Checksum.map((c) => this.constructHashTag(c)).join('\n')}
    <size>${product.ContentLength}</size>
    <url>${this.constructDownloadUrl(product.Id)}</url>
  </file>`;
  }

  private constructHashTag(checksum: DdipProductChecksum) {
    return `<hash type="${checksum.Algorithm}">${checksum.Value}</hash>"`;
  }
}
