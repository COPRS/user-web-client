export function fixFootprints(
  coordinates: [number, number][]
): [number, number][] {
  return coordinates.map((c) => {
    if (c[0] < 0) {
      c[0] = c[0] + 360;
    }
    return c;
  });
}
