import { FileSizePipe } from './file-size.pipe';

describe('FileSizePipe', () => {
  let component: FileSizePipe;

  beforeEach(async () => {
    component = new FileSizePipe();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return a filesize', () => {
    expect(component.transform(4711)).toEqual('5 KB');
  });

  it('should return with a given precision', () => {
    expect(component.transform(4096, 2)).toEqual('4.00 KB');
  });

  it('should return a question mark if non-number is given', () => {
    expect(component.transform('some-text' as any)).toEqual('?');
  });
});
