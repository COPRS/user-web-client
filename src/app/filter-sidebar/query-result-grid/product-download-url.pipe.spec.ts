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

import { ProductDownloadUrlPipe } from 'src/app/filter-sidebar/query-result-grid/product-download-url.pipe';

class MockDdipService {
  constructDownloadUrl(id: string) {
    return 'hppt://server/' + id + '/½¼value';
  }
}

describe('ProductDownloadUrlPipe', () => {
  let component: ProductDownloadUrlPipe;

  beforeEach(async () => {
    component = new ProductDownloadUrlPipe(new MockDdipService() as any);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return empty string when no product is given', () => {
    expect(component.transform()).toBe('');
  });

  it('should return the full download url when product with Id is given', () => {
    expect(component.transform({ Id: 'this-is-some-id' } as any)).toEqual(
      'hppt://server/this-is-some-id/½¼value'
    );
  });
});
