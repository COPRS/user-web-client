import { fixFootprints } from './foot-print-fixer.util';

describe('FootPrintFixerService', () => {
  it('should be created', () => {
    expect(fixFootprints).toBeTruthy();
  });

  it('should leave an ok footprint as is', () => {
    const footprint: [number, number][] = [
      [1, 1],
      [2, 2],
      [3, 3],
    ];
    expect(fixFootprints(footprint)).toEqual([
      [1, 1],
      [2, 2],
      [3, 3],
    ]);
  });

  it('should fix a footprint', () => {
    const footprint: [number, number][] = [[-3, 3]];
    expect(fixFootprints(footprint)).toEqual([[357, 3]]);
  });

  it('should fix a footprint', () => {
    const footprint: [number, number][] = [[0, 2]];
    expect(fixFootprints(footprint)).toEqual([[0, 2]]);
  });

  it('should fix a footprint', () => {
    const footprint: [number, number][] = [[-1, 2]];
    expect(fixFootprints(footprint)).toEqual([[359, 2]]);
  });

  it('should fix a footprint', () => {
    const footprint: [number, number][] = [[-1, -22]];
    expect(fixFootprints(footprint)).toEqual([[359, -22]]);
  });
});
