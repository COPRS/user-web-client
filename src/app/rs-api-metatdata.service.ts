import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RsApiMetatdataService {
  private rsApiUrl = 'http://localhost:8888';

  constructor(private http: HttpClient) {}

  getMissions(): PromiseLike<any> {
    return this.http.get(this.rsApiUrl + '/api/v1/missions').toPromise();
  }

  getProductTypes(mission: String): PromiseLike<any> {
    return this.http
      .get(this.rsApiUrl + '/api/v1/missions/' + mission + '/productTypes')
      .toPromise();
  }

  getAttributes(mission: String, productType: String): PromiseLike<any> {
    return this.http
      .get(
        this.rsApiUrl +
          '/api/v1/missions/' +
          mission +
          '/productTypes/' +
          productType +
          '/attributes'
      )
      .toPromise();
  }
}
