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

import { FileSizePipe } from './file-size.pipe';

describe('FileSizePipe', () => {
  let component: FileSizePipe;

  beforeEach(async () => {
    component = new FileSizePipe();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return a filesize', () => {
    expect(component.transform(4711)).toEqual('5 KB');
  });

  it('should return with a given precision', () => {
    expect(component.transform(4096, 2)).toEqual('4.00 KB');
  });

  it('should return a question mark if non-number is given', () => {
    expect(component.transform('some-text' as any)).toEqual('?');
  });
});
