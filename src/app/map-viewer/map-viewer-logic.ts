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
