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

import { Feature, Map } from 'ol';
import { singleClick } from 'ol/events/condition';
import { Select } from 'ol/interaction';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  FilterSidebarNavigationService,
  SideBarSubNav,
} from '../filter-sidebar/services/filter-sidebar-navigation.service';
import { ProductSelectionService } from '../services/product-selection.service';
import { LayerType } from './map-viewer.component';
import { MapViewerSelectionStylesService } from './services/map-viewer-selection-styles.service';

export function configureMapHighlight(
  map: Map,
  productSelectionService: ProductSelectionService,
  filterSidebarNavigationService: FilterSidebarNavigationService,
  mapViewerSelectionStylesService: MapViewerSelectionStylesService,
  onDestroy: Subject<void>
) {
  function selectStyle(feature: Feature) {
    mapViewerSelectionStylesService
      .getSelectStyle(feature, productSelectionService)
      .then((style) => feature.setStyle(style));
  }
  const select = new Select({
    condition: singleClick,
    style: selectStyle,
  });

  if (select !== null) {
    map.removeInteraction(select);
    map.addInteraction(select);

    select.on('select', (e) => {
      productSelectionService.unsetHighlightProduct();

      if (e.selected.length !== 0) {
        e.selected.forEach((s) => {
          const product = s.get('product');
          if (product) {
            productSelectionService.setHighlightProduct(product);
          }
        });
        filterSidebarNavigationService.setSelectedSubNav(SideBarSubNav.DETAILS);
        filterSidebarNavigationService.setShowNav(true);
      }
    });
  }

  productSelectionService
    .getHighlightedProduct()
    .pipe(takeUntil(onDestroy))
    .subscribe((highlightedFeature) => {
      select.getFeatures().clear();
      if (highlightedFeature) {
        const features = map
          .getLayers()
          .getArray()
          .filter((l) => {
            if (l) {
              const props = l.getProperties();
              if (props.layerType === LayerType.Data) {
                return true;
              }
            }
            return false;
          })
          .map((l: VectorLayer<VectorSource>) =>
            l
              .getSource()
              .getFeatures()
              .filter((f) => {
                const props = f.getProperties();
                return props?.product?.Id === highlightedFeature.Id;
              })
          );
        features.forEach((f) =>
          f.forEach((ff) => select.getFeatures().push(ff))
        );
      }
    });
}
