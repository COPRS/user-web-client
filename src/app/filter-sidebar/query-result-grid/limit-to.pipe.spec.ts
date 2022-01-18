import { LimitToPipe } from './limit-to.pipe';

describe('LimitToPipe', () => {
  let component: LimitToPipe;

  beforeEach(async () => {
    component = new LimitToPipe();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    expect(component.transform('somelongstring', 3)).toEqual('som...');
  });
});
