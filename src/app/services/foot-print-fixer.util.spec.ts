import { shiftFootprints } from './foot-print-fixer.util';

describe('FootPrintFixerService', () => {
  it('should be created', () => {
    expect(shiftFootprints).toBeTruthy();
  });

  it('should leave an ok footprint as is', () => {
    const footprint: [number, number][] = [
      [1, 1],
      [2, 2],
      [3, 3],
    ];
    expect(shiftFootprints(footprint)).toEqual([
      [1, 1],
      [2, 2],
      [3, 3],
    ]);
  });

  it('should fix a footprint', () => {
    const footprint: [number, number][] = [[-3, 3]];
    expect(shiftFootprints(footprint)).toEqual([[357, 3]]);
  });

  it('should fix a footprint', () => {
    const footprint: [number, number][] = [[0, 2]];
    expect(shiftFootprints(footprint)).toEqual([[0, 2]]);
  });

  it('should fix a footprint', () => {
    const footprint: [number, number][] = [[-1, 2]];
    expect(shiftFootprints(footprint)).toEqual([[359, 2]]);
  });

  it('should fix a footprint', () => {
    const footprint: [number, number][] = [[-1, -22]];
    expect(shiftFootprints(footprint)).toEqual([[359, -22]]);
  });
});
