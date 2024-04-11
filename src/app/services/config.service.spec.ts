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

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { sleep } from '@cds/core/internal';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ConfigService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('load() should correctly load json file', inject(
    [HttpTestingController],
    (httpMock: HttpTestingController) => {
      expect(service.load()).toBeTruthy();

      const mockReq = httpMock.expectOne('./assets/config.json');
      expect(mockReq.request.method).toEqual('GET');
      mockReq.flush({ payload: Object.values({}) });
    }
  ));

  it('load() should have settings set after load', inject(
    [HttpTestingController],
    async (httpMock: HttpTestingController) => {
      expect(service.load().then((resp) => expect(resp).toEqual(true)));

      const mockReq = httpMock.expectOne('./assets/config.json');
      expect(mockReq.request.method).toEqual('GET');
      mockReq.flush({ apiUrl: 'some-url-here:4711' });

      await sleep(100);
      expect(service.settings).toEqual({
        apiUrl: 'some-url-here:4711',
        filterConfig: [
          {
            attributeName: 'SensingDate',
            valueType: 'date',
          },
        ],
      } as any);
    }
  ));

  it('load() should fail when config file can not be loaded', inject(
    [HttpTestingController],
    async (httpMock: HttpTestingController) => {
      expect(
        service
          .load()
          .catch((resp) =>
            expect(resp).toEqual('Failed to load the config file')
          )
      );

      const mockReq = httpMock.expectOne('./assets/config.json');
      mockReq.error(new ErrorEvent('file not found'));
    }
  ));

  it('should be created', () => {
    service.setApiUrl('some-nice-url');
    expect(service.settings.apiUrl).toEqual('some-nice-url');
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
