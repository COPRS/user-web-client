import { ProductDownloadUrlPipe } from 'src/app/filter-sidebar/query-result-grid/product-download-url.pipe';

class MockDdipService {
  constructDownloadUrl(id: string) {
    return 'hppt://server/' + id + '/½¼value';
  }
}

describe('ProductDownloadUrlPipe', () => {
  let component: ProductDownloadUrlPipe;

  beforeEach(async () => {
    component = new ProductDownloadUrlPipe(new MockDdipService() as any);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return empty string when no product is given', () => {
    expect(component.transform()).toBe('');
  });

  it('should return the full download url when product with Id is given', () => {
    expect(component.transform({ Id: 'this-is-some-id' } as any)).toEqual(
      'hppt://server/this-is-some-id/½¼value'
    );
  });
});
