/**
 * Function to fix footprints that are based on a -180/180 plane
 * Shifts negative x values to the right side so they can be displayed by OpenLayers
 *
 * Remark related to RS-713:
 * Possible closely related to "new sourceVector({wrapX: true)}"
 * Or see: https://github.com/openlayers/openlayers/issues/13792#issuecomment-1167228519
 *
 * @param coordinates
 * @returns
 */
export function shiftFootprints(
  coordinates: [number, number][]
): [number, number][] {
  return coordinates.map((c) => {
    if (c[0] < 0) {
      c[0] = c[0] + 360;
    }
    return c;
  });
}
