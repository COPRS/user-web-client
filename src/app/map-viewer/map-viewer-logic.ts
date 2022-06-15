import { Feature, Map } from 'ol';
import { doubleClick, singleClick } from 'ol/events/condition';
import { Select } from 'ol/interaction';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import { combineLatest, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import {
  FilterSidebarNavigationService,
  SideBarSubNav,
} from '../filter-sidebar/services/filter-sidebar-navigation.service';
import { DdipProduct } from '../services/models/DdipProductResponse';
import { ProductSelectionService } from '../services/product-selection.service';
import { LayerType } from './map-viewer.component';

const highlightedStyle = new Style({
  fill: new Fill({
    color: 'rgba(50, 211, 63, 0.4',
  }),
  stroke: new Stroke({
    color: 'rgba(50, 211, 63, 0.8)',
    width: 6,
  }),
});

const selectedStyle = new Style({
  fill: new Fill({
    color: 'rgba(0, 114, 163, 0.4',
  }),
  stroke: new Stroke({
    color: 'rgba(0, 114, 163, 0.8)',
    width: 3,
  }),
});

const bothStyle = highlightedStyle.clone();
bothStyle.setFill(selectedStyle.getFill());

async function getSelectStyle(
  feature: Feature,
  productSelectionService: ProductSelectionService
): Promise<Style> {
  const product = (feature as any).values_.product as DdipProduct;
  return new Promise((resolve, _reject) => {
    combineLatest([
      productSelectionService.getHighlightedProduct(),
      productSelectionService.getSelectedProducts(),
    ])
      .pipe(take(1))
      .subscribe(([highlighted, selectedProducts]) => {
        const isCurrentHighlighted = product.Id === highlighted?.Id;
        const isCurrentSelected = selectedProducts?.some(
          (p) => p.Id === product.Id
        );
        if (isCurrentHighlighted && isCurrentSelected) {
          resolve(bothStyle);
        } else if (isCurrentHighlighted) {
          resolve(highlightedStyle);
        } else {
          resolve(selectedStyle);
        }
      });
  });
}

export function configureMapSelect(
  map: Map,
  productSelectionService: ProductSelectionService,
  filterSidebarNavigationService: FilterSidebarNavigationService,
  onDestroy: Subject<void>
) {
  function selectStyle(feature: Feature) {
    getSelectStyle(feature, productSelectionService).then((style) =>
      feature.setStyle(style)
    );
  }

  const select = new Select({
    condition: singleClick,
    style: selectStyle,
  });

  if (select !== null) {
    map.removeInteraction(select);
    map.addInteraction(select);

    select.on('select', (e) => {
      if (e.selected.length !== 0) {
        e.selected.forEach((s) =>
          productSelectionService.addSelectedProduct((s as any).values_.product)
        );

        filterSidebarNavigationService.setShowNav(true);
      }
      if (e.deselected.length !== 0) {
        e.deselected.forEach((d) =>
          productSelectionService.removeSelectedProduct(
            (d as any).values_.product
          )
        );
      }

      if (e.selected.length === 0 && e.deselected.length === 0) {
        productSelectionService.clearSelectedProducts();
      }
    });
  }

  productSelectionService
    .getSelectedProducts()
    .pipe(takeUntil(onDestroy))
    .subscribe((selectedFeatures) => {
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
              return selectedFeatures.some((s) => props?.product?.Id === s.Id);
            })
        );

      select.getFeatures().clear();
      features.forEach((f) => f.forEach((ff) => select.getFeatures().push(ff)));
    });
}

export function configureMapHighlight(
  map: Map,
  productSelectionService: ProductSelectionService,
  filterSidebarNavigationService: FilterSidebarNavigationService,
  onDestroy: Subject<void>
) {
  function selectStyle(feature: Feature) {
    getSelectStyle(feature, productSelectionService).then((style) =>
      feature.setStyle(style)
    );
  }
  const select = new Select({
    condition: doubleClick,
    style: selectStyle,
  });

  if (select !== null) {
    map.removeInteraction(select);
    map.addInteraction(select);

    select.on('select', (e) => {
      productSelectionService.unsetHighlightProduct();

      if (e.selected.length !== 0) {
        e.selected.forEach((s) =>
          productSelectionService.setHighlightProduct(
            (s as any).values_.product
          )
        );
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
