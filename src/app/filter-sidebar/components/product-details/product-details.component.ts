import { Component, OnDestroy } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { ConfigService } from 'src/app/services/config.service';
import { DdipService } from 'src/app/services/ddip/ddip.service';
import { DdipProduct } from 'src/app/services/models/DdipProductResponse';
import { ProductSelectionService } from 'src/app/services/product-selection.service';
import { QueryResultService } from '../../services/query-result.service';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnDestroy {
  showSideNav$: Observable<boolean>;
  selectedProduct$: Observable<DdipProduct>;
  selectedProductPageIndex$: Observable<
    { idx: number; totalLength: number } | undefined
  >;
  additionalAttributes: {
    label: string;
    value: string;
  }[] = [];
  quicklookImageLoadError = false;

  private readonly onDestroy = new Subject<void>();

  constructor(
    private productSelectionService: ProductSelectionService,
    private queryResultService: QueryResultService,
    private ddipService: DdipService,
    private configService: ConfigService,
    private http: HttpClient
  ) {
    this.showSideNav$ = this.productSelectionService
      .getHighlightedProduct()
      .pipe(map((p) => !!p));
    this.selectedProduct$ =
      this.productSelectionService.getHighlightedProduct();
    this.selectedProductPageIndex$ = combineLatest([
      this.selectedProduct$,
      this.queryResultService
        .getFilteredProducts()
        .pipe(map((r) => r.products)),
    ]).pipe(
      map((e) => {
        const [selected, currentPage] = e;
        if (selected && currentPage) {
          const idx = currentPage.findIndex((f) => f.Id === selected.Id);
          return { idx, totalLength: currentPage.length };
        } else {
          return undefined;
        }
      })
    );

    this.selectedProduct$
      .pipe(takeUntil(this.onDestroy))
      .subscribe((product) => {
        this.fillAdditionalAttributes(product);
      });
  }

  selectPreviousProduct() {
    this.goToOffsetIntList(-1);
  }

  selectNextProduct() {
    this.goToOffsetIntList(1);
  }

  downloadProduct() {
    this.selectedProduct$.pipe(take(1)).subscribe((res) => {
      if (res?.Id) {
        let downloadUrl = this.ddipService.constructDownloadUrl(res.Id);
        this.http
          .get(downloadUrl, { responseType: 'blob' })
          .subscribe((response) => {
            saveAs(response, res.Name);
          });
      }
    });
  }

  goToOffsetIntList(offset: number) {
    combineLatest([
      this.selectedProductPageIndex$,
      this.queryResultService
        .getFilteredProducts()
        .pipe(map((r) => r.products)),
    ])
      .pipe(take(1))
      .subscribe((res) => {
        const [selected, currentPage] = res;
        if (selected && currentPage) {
          const nextIdx = selected.idx + offset;

          if (nextIdx >= 0 && nextIdx < currentPage.length) {
            this.productSelectionService.unsetHighlightProduct();
            this.productSelectionService.setHighlightProduct(
              currentPage[nextIdx]
            );
          }
        }
      });
  }

  onQuicklookImageError() {
    this.quicklookImageLoadError = true;
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  private fillAdditionalAttributes(product: DdipProduct) {
    // Reset list
    this.additionalAttributes = [];

    // Fill list with each configured attribute, if present on product
    this.configService.settings.additionalAttributes.forEach(
      (configAttribute) => {
        const index = product.ExtendedAttributes.findIndex(
          (attribute) => attribute.Name == configAttribute.value
        );
        if (index !== -1) {
          this.additionalAttributes.push({
            label: configAttribute.label,
            value: product.ExtendedAttributes[index].Value + '',
          });
        }
      }
    );
  }

  rootDirectory: any[] = [
    {
      name: 'Files',
      icon: 'folder',
      expanded: true,
      files: [
        {
          icon: 'file',
          name: 'file',
          active: false,
        },
        {
          icon: 'file',
          name: 'file',
          active: false,
        },
        {
          icon: 'file',
          name: 'file',
          active: false,
        },
        {
          icon: 'file',
          name: 'file',
          active: false,
        },
      ],
    },
  ];
}
