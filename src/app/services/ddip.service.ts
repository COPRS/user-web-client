import { Injectable } from '@angular/core';
import { o } from 'odata';

@Injectable({
  providedIn: 'root',
})
export class DdipService {
  constructor() {}
  private url = 'https://scihub.copernicus.eu/dhus/odata/v1/';

  async tryScuHub(): Promise<Array<DdipResponse>> {
    const g = o(this.url, {
      headers: new Headers({
        Authorization: 'Basic ADD_AUTH_HERE',
      }),
    });
    const res = await g.get('Products').query({ $format: 'json', $top: 5 });

    return res.d.results;
  }
}

export interface DdipResponse {
  ContentGeometry: string;
}
