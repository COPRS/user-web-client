import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAppConfig } from './models/IAppConfig';
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
            this.settings = response;
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
