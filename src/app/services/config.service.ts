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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAppConfig, IAppFilterConfig } from './models/IAppConfig';
import { BehaviorSubject } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  settings: IAppConfig = {} as any;
  private settings$: BehaviorSubject<IAppConfig> = new BehaviorSubject(
    undefined
  );

  constructor(private http: HttpClient) {}

  load() {
    return new Promise<boolean>(
      (resolve: (a: boolean) => void, reject): void => {
        this.http
          .get('./assets/config.json')
          .toPromise()
          .then((response: IAppConfig) => {
            this.settings = mergeWithDefaultConfig(response);
            this.settings$.next(this.settings);
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

  public getSettings(): Promise<IAppConfig> {
    return new Promise((res) => {
      this.settings$
        .pipe(
          filter((e) => e !== undefined),
          take(1)
        )
        .subscribe((c) => res(c));
    });
  }

  public setApiUrl(url: string): void {
    this.settings.apiUrl = url;
  }
}

function mergeWithDefaultConfig(config: IAppConfig) {
  const mergedFilterConfig = [
    ...new Set([
      ...(config?.filterConfig || []),
      ...DEFAULT_CONFIG.filterConfig,
    ]),
  ];
  var resFilterConfig: IAppFilterConfig[] = [];
  mergedFilterConfig.forEach((item) => {
    var i = resFilterConfig.findIndex(
      (x) => x.attributeName == item.attributeName
    );
    if (i <= -1) {
      resFilterConfig.push(item);
    }
  });
  config.filterConfig = resFilterConfig;

  return config;
}

const DEFAULT_CONFIG: Partial<IAppConfig> = {
  filterConfig: [{ attributeName: 'SensingDate', valueType: 'date' }],
};
