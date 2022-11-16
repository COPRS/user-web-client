import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PRODUCT_TYPE_EXTENDED_ATTRIBUTE_NAME } from 'src/app/filter-sidebar/components/filter-element/filter-element.component';
import { PaginationConfig } from '../../filter-sidebar/services/query-result.service';
import { ConfigService } from '../config.service';
import {
  DdipProduct,
  DdipProductChecksum,
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
    if (pageConfig.skip) {
      query.$skip = pageConfig.skip;
    }
    if (pageConfig.top) {
      query.$top = pageConfig.top;
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
      };
    });
  }
}
