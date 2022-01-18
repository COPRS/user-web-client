import { FileSizePipe } from './file-size.pipe';

describe('FileSizePipe', () => {
  let component: FileSizePipe;

  beforeEach(async () => {
    component = new FileSizePipe();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    expect(component.transform(4711)).toEqual('5 KB');
  });
});
