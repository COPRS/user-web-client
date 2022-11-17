import { TestBed } from '@angular/core/testing';
import { sleep } from '@cds/core/internal';
import { take } from 'rxjs/operators';
import { DdipProduct } from './models/DdipProductResponse';

import { ProductSelectionService } from './product-selection.service';

const EXAMPLE_PRODUCT: DdipProduct = {
  Id: 'S1_Test_2',
  '@odata.mediaContentType': 'asd',
  Checksum: [
    { Algorithm: 'md5', ChecksumDate: '2022-02-01', Value: '123456789' },
  ],
  ContentDate: { Start: '2022-02-01', End: '2022-02-02' },
  ContentLength: 44711,
  ContentType: 'binary',
  EvictionDate: '2021-11-25',
  PublicationDate: '2021-11-26',
  Name: 'S1_Test_2',
  ProductionType: 'Test_Production_Type',
  ProductType: 'Test_Product_Type',
  Footprint: {
    coordinates: [
      [
        [12.244422, 65.691597],
        [11.271685, 67.158249],
        [17.056625, 67.635971],
        [17.70257, 66.152351],
        [12.244422, 65.691597],
      ],
    ],
    type: 'Polygon',
  } as any,
  Quicklooks: [],
};

const EXAMPLE_PRODUCT_CLONE: DdipProduct = JSON.parse(
  JSON.stringify(EXAMPLE_PRODUCT)
);

describe('ProductSelectionService', () => {
  let service: ProductSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an Observable', () => {
    service
      .getSelectedProducts()
      .pipe(take(1))
      .subscribe((r) => {
        expect(r).toBeTruthy();
        expect(r.length).toBe(0);
        expect(r).toEqual([]);
      });
  });

  it('should return add one and return one Product', async () => {
    service.addSelectedProduct(EXAMPLE_PRODUCT);
    service
      .getSelectedProducts()
      .pipe(take(1))
      .subscribe((r) => {
        expect(r).toBeTruthy();
        expect(r.length).toBe(1);
        expect(r).toEqual([EXAMPLE_PRODUCT_CLONE]);
      });
  });

  it('should return add and return two Products', () => {
    const EXAMPLE_PRODUCT2: DdipProduct = JSON.parse(
      JSON.stringify(EXAMPLE_PRODUCT)
    );
    EXAMPLE_PRODUCT2.Id = EXAMPLE_PRODUCT2.Id + 'abc';

    service.addSelectedProduct(EXAMPLE_PRODUCT);
    service.addSelectedProduct(EXAMPLE_PRODUCT2);

    service
      .getSelectedProducts()
      .pipe(take(1))
      .subscribe((r) => {
        expect(r).toBeTruthy();
        expect(r.length).toBe(2);
        expect(r).toEqual([EXAMPLE_PRODUCT, EXAMPLE_PRODUCT2]);
      });
  });

  it('should return one product when two the same product gets added two times', () => {
    service.addSelectedProduct(EXAMPLE_PRODUCT);
    service.addSelectedProduct(EXAMPLE_PRODUCT);

    service
      .getSelectedProducts()
      .pipe(take(1))
      .subscribe((r) => {
        expect(r).toBeTruthy();
        expect(r.length).toBe(1);
        expect(r).toEqual([EXAMPLE_PRODUCT]);
      });
  });

  it('should remove one object of a list of two', () => {
    const EXAMPLE_PRODUCT2: DdipProduct = JSON.parse(
      JSON.stringify(EXAMPLE_PRODUCT)
    );
    EXAMPLE_PRODUCT2.Id = EXAMPLE_PRODUCT2.Id + 'abc';

    service.addSelectedProduct(EXAMPLE_PRODUCT);
    service.addSelectedProduct(EXAMPLE_PRODUCT2);
    sleep(100);
    service.removeSelectedProduct(EXAMPLE_PRODUCT2);

    service
      .getSelectedProducts()
      .pipe(take(1))
      .subscribe((r) => {
        expect(r).toBeTruthy();
        expect(r.length).toBe(1);
        expect(r).toEqual([EXAMPLE_PRODUCT]);
      });
  });

  it('should remove one object of a list of three', () => {
    const EXAMPLE_PRODUCT2: DdipProduct = JSON.parse(
      JSON.stringify(EXAMPLE_PRODUCT)
    );
    EXAMPLE_PRODUCT2.Id = EXAMPLE_PRODUCT2.Id + 'abc';

    const EXAMPLE_PRODUCT3: DdipProduct = JSON.parse(
      JSON.stringify(EXAMPLE_PRODUCT)
    );
    EXAMPLE_PRODUCT3.Id = EXAMPLE_PRODUCT3.Id + 'abcdef';

    service.addSelectedProduct(EXAMPLE_PRODUCT);
    service.addSelectedProduct(EXAMPLE_PRODUCT2);
    service.addSelectedProduct(EXAMPLE_PRODUCT3);
    service.removeSelectedProduct(EXAMPLE_PRODUCT3);

    service
      .getSelectedProducts()
      .pipe(take(1))
      .subscribe((r) => {
        expect(r).toBeTruthy();
        expect(r.length).toBe(2);
        expect(r).toEqual([EXAMPLE_PRODUCT, EXAMPLE_PRODUCT2]);
      });
  });

  it('should remove all objects of a list', () => {
    const EXAMPLE_PRODUCT2: DdipProduct = JSON.parse(
      JSON.stringify(EXAMPLE_PRODUCT)
    );
    EXAMPLE_PRODUCT2.Id = EXAMPLE_PRODUCT2.Id + 'abc';

    const EXAMPLE_PRODUCT3: DdipProduct = JSON.parse(
      JSON.stringify(EXAMPLE_PRODUCT)
    );
    EXAMPLE_PRODUCT3.Id = EXAMPLE_PRODUCT3.Id + 'abcdef';

    service.addSelectedProduct(EXAMPLE_PRODUCT);
    service.addSelectedProduct(EXAMPLE_PRODUCT2);
    service.addSelectedProduct(EXAMPLE_PRODUCT3);
    service.removeSelectedProduct(EXAMPLE_PRODUCT);
    service.removeSelectedProduct(EXAMPLE_PRODUCT2);
    service.removeSelectedProduct(EXAMPLE_PRODUCT3);

    service
      .getSelectedProducts()
      .pipe(take(1))
      .subscribe((r) => {
        expect(r).toBeTruthy();
        expect(r.length).toBe(0);
        expect(r).toEqual([]);
      });
  });

  it('should clear a list', () => {
    const EXAMPLE_PRODUCT2: DdipProduct = JSON.parse(
      JSON.stringify(EXAMPLE_PRODUCT)
    );
    EXAMPLE_PRODUCT2.Id = EXAMPLE_PRODUCT2.Id + 'abc';

    const EXAMPLE_PRODUCT3: DdipProduct = JSON.parse(
      JSON.stringify(EXAMPLE_PRODUCT)
    );
    EXAMPLE_PRODUCT3.Id = EXAMPLE_PRODUCT3.Id + 'abcdef';

    service.addSelectedProduct(EXAMPLE_PRODUCT);
    service.addSelectedProduct(EXAMPLE_PRODUCT2);
    service.addSelectedProduct(EXAMPLE_PRODUCT3);
    service.clearSelectedProducts();

    service
      .getSelectedProducts()
      .pipe(take(1))
      .subscribe((r) => {
        expect(r).toBeTruthy();
        expect(r.length).toBe(0);
        expect(r).toEqual([]);
      });
  });
});
