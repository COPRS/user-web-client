import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { MapViewerService } from 'src/app/map-viewer/services/map-viewer.service';
import { ConfigService } from 'src/app/services/config.service';
import { DdipProduct } from 'src/app/services/models/DdipProductResponse';
import { ProductSelectionService } from 'src/app/services/product-selection.service';
import {
  FilterSidebarNavigationService,
  SideBarSubNav,
} from '../services/filter-sidebar-navigation.service';
import { QueryResultService } from '../services/query-result.service';
import * as splitGeoJSON from 'geojson-antimeridian-cut';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

@Component({
  selector: 'app-query-result-grid',
  templateUrl: './query-result-grid.component.html',
  styleUrls: ['./query-result-grid.component.scss'],
})
export class QueryResultGridComponent implements OnInit, OnDestroy {
  products: DdipProduct[];
  total: number;
  pageSize: number = 100;
  page: number = 1;
  loading: Observable<boolean>;
  public selected: DdipProduct[];
  public highlightedProduct: DdipProduct;
  public highlightedProductBackgroundColor: string;
  private readonly onDestroy = new Subject<void>();
  initializationFinished: boolean = false;

  constructor(
    private queryResultService: QueryResultService,
    private productSelectionService: ProductSelectionService,
    private filterSidebarNavigationService: FilterSidebarNavigationService,
    private mapViewerService: MapViewerService,
    private configService: ConfigService
  ) {
    this.loading = this.queryResultService
      .getIsLoading()
      .pipe(map((l) => l.loading));
  }

  ngOnInit(): void {
    this.configService.getSettings().then((c) => {
      this.highlightedProductBackgroundColor = c.mapView.highlightFillColor;
    });

    this.queryResultService.getPagination().subscribe((initialPagination) => {
      this.page = initialPagination.page;
      this.pageSize = initialPagination.pageSize;
      // If we don't use a timeout here, the page gets overwritten as the browser is to fast
      setTimeout(() => {
        this.initializationFinished = true;
      }, 100);
    });

    this.queryResultService
      .getFilteredProducts()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((page) => {
        this.products = page.products;
        this.total = page.totalCount;
      });

    this.productSelectionService
      .getSelectedProducts()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(async (selected) => {
        if (!selected) {
          this.selected = [];
        } else {
          this.selected = this.products.filter((e) =>
            selected.some((s) => e.Id === s.Id)
          );
        }
      });

    this.productSelectionService
      .getHighlightedProduct()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(async (highlighted) => {
        if (!highlighted) {
          this.highlightedProduct = undefined;
        } else {
          this.highlightedProduct = highlighted;
        }
      });
  }

  refresh(state: ClrDatagridStateInterface) {
    if (this.initializationFinished) {
      console.log(state.page.current, state.page.size);

      this.queryResultService.setPagination(
        state.page.size,
        state.page.current
      );
    }
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  goToDetailsTab($event) {
    const selectedProduct = $event as DdipProduct;
    this.productSelectionService.setHighlightProduct(selectedProduct);
    this.filterSidebarNavigationService.setSelectedSubNav(
      SideBarSubNav.DETAILS
    );
    this.filterSidebarNavigationService.setShowNav(true);
  }

  focusMapOnFootprint($event) {
    const selectedProduct = $event as DdipProduct;

    selectedProduct.Footprint = splitGeoJSON(selectedProduct.Footprint);

    let source = new VectorSource({
      features: new GeoJSON().readFeatures(
        {
          type: 'FeatureCollection',
          crs: {
            type: 'name',
            properties: {
              name: 'urn:ogc:def:crs:EPSG::4326',
            },
          },

          features: [
            {
              type: 'Feature',
              properties: { selectedProduct },
              geometry: selectedProduct.Footprint,
            },
          ],
        },
        {
          featureProjection: 'EPSG:3857',
        }
      ),
    });
    this.mapViewerService.setZoomToExtent(source.getExtent());
    this.productSelectionService.setHighlightProduct(selectedProduct);
  }

  rowClicked(product: DdipProduct) {
    this.productSelectionService.setHighlightProduct(product);
  }

  rowDoubleClicked(product: DdipProduct) {
    this.goToDetailsTab(product);
  }
}
