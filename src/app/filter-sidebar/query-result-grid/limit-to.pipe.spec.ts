import { LimitToPipe } from './limit-to.pipe';

describe('LimitToPipe', () => {
  let component: LimitToPipe;

  beforeEach(async () => {
    component = new LimitToPipe();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should cap a string and add three dots', () => {
    expect(component.transform('somelongstring', 3)).toEqual('som...');
  });

  it('should return the full string if no length is given', () => {
    expect(component.transform('somelongstring')).toEqual('somelongstring');
  });

  it('should return a question mark if input of non-text is given', () => {
    expect(component.transform(888888 as any)).toEqual('?');
  });
});
