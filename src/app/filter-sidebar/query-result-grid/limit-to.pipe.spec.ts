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

import { LimitToPipe } from './limit-to.pipe';

describe('LimitToPipe', () => {
  let component: LimitToPipe;

  beforeEach(async () => {
    component = new LimitToPipe();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should cap a string and add three dots', () => {
    expect(component.transform('somelongstring', 3)).toEqual('som...');
  });

  it('should return the full string if no length is given', () => {
    expect(component.transform('somelongstring')).toEqual('somelongstring');
  });

  it('should return a question mark if input of non-text is given', () => {
    expect(component.transform(888888 as any)).toEqual('?');
  });
});
