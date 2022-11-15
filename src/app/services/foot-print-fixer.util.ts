/**
 * Function to fix footprints that are based on a -180/180 plane
 * Shifts x values to the right so they can be displayed by OpenLayers
 *
 * @param coordinates
 * @returns
 */
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
