import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAppConfig } from './models/IAppConfig';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  settings: IAppConfig;

  constructor(private http: HttpClient) {}

  load() {
    return new Promise<boolean>(
      (resolve: (a: boolean) => void, reject): void => {
        this.http
          .get('./assets/config.json')
          .toPromise()
          .then((response: IAppConfig) => {
            this.settings = response;
            resolve(true);
          })
          .catch((_response: any) => {
            const errorMessage = 'Failed to load the config file';
            alert(errorMessage);
            reject(errorMessage);
          });
      }
    );
  }

  public setApiBaseUrl(url: string): void {
    this.settings.apiBaseUrl = url;
  }
  public setResourceType(resourceName: string): void {
    this.settings.resourceName = resourceName;
  }
}
