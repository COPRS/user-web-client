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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterElementsService } from 'src/app/filter-sidebar/services/filter-elements.service';
import { FilterElementListComponent } from './filter-element-list.component';

class MockFilterElementsService {
  public getFilter() {}
}

describe('FilterElementListComponent', () => {
  let component: FilterElementListComponent;
  let fixture: ComponentFixture<FilterElementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterElementListComponent],
      providers: [
        FilterElementListComponent,
        {
          provide: FilterElementsService,
          useClass: MockFilterElementsService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterElementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
