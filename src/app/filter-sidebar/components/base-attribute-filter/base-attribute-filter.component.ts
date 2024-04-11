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

import { Component, Input, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AttributeQueryParameter } from '../../models/AttributeQuery';

@Component({ template: '' })
export class BaseAttributeFilterComponent {
  @Input()
  attributeName: string;

  @Output()
  attributeFilterChanged$: Observable<Array<AttributeQueryParameter>>;

  attributeFilterChangesSubject = new BehaviorSubject<
    Array<AttributeQueryParameter>
  >([]);

  constructor() {
    this.attributeFilterChanged$ =
      this.attributeFilterChangesSubject.asObservable();
  }
}
